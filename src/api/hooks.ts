import { useAtom } from 'jotai';
import { handleException } from '.';
import { decrypt_note, encrypt_note, KeyMaterial, retrieveMainKey } from '../components/crypto';
import { getMetadata, sortDeletedNotes, sortNotes } from '../components/util';
import { addToNoteListState, authState, currentNoteState, getEditorState, getUserInfoState, noteListState, noteStatusState } from '../components/state';
import {
  AuthStatus,
  DeletedNoteListItem,
  DeletedNoteListItemDto,
  NoteListItem,
  NoteListItemDto,
  NoteStatus,
} from '../types';
import {
  get_deleted_notes,
  get_note,
  get_notes,
  save_note,
  update_note,
} from './note_api';

export const useGetNote = (): ((id: string) => Promise<void>) => {
  const [editor] = useAtom(getEditorState);
  const [,setNoteStatus] = useAtom(noteStatusState);
  const [,setCurrentNote] = useAtom(currentNoteState);
  const [,addToNoteList] = useAtom(addToNoteListState);
  const [userInfo] = useAtom(getUserInfoState);

  return async (id: string) => {
    setNoteStatus(NoteStatus.INPROGRESS);
    const noteDto = await get_note(id).catch(handleException);
    setNoteStatus(NoteStatus.SYNCED);

    if (!noteDto || !userInfo) {
      return;
    }

    const key: KeyMaterial = JSON.parse(noteDto?.key);

    const decrypted_note = await decrypt_note(
      key,
      userInfo?.username,
      noteDto?.metadata,
      noteDto?.content
    );

    const parsedMetadata = JSON.parse(decrypted_note?.metadata ?? '');

    const note = {
      key,
      id: noteDto?.id,
      created_at: noteDto?.created_at,
      modified_at: noteDto?.modified_at,
      metadata: parsedMetadata,
      content: decrypted_note?.content ?? '',
    };

    setCurrentNote(note);
    addToNoteList(note);

    editor?.commands.focus();
  };
};

export const useSaveNote = (): (() => Promise<void>) => {
  const [editor] = useAtom(getEditorState);
  const [noteStatus, setNoteStatus] = useAtom(noteStatusState);
  const [currentNote, setCurrentNote] = useAtom(currentNoteState);
  const [,addToNoteList] = useAtom(addToNoteListState);
  const [userInfo] = useAtom(getUserInfoState);

  return async () => {
    if (!userInfo) {
      return;
    }

    editor?.commands?.focus();

    const content = editor?.getHTML() ?? '';
    const metadata = getMetadata(content);

    const mainKey = await retrieveMainKey(userInfo?.username);

    if (!mainKey) {
      console.error('No main key in indexeddb');
      return
    }

    // No changes to be saved
    if (noteStatus === NoteStatus.SYNCED) {
      return;
    }

    const encrypted_note = await encrypt_note(
      mainKey,
      userInfo?.username,
      content,
      metadata,
      currentNote?.key?.wrapped_key
    );

    const request = {
      metadata: encrypted_note?.encrypted_metadata,
      key: JSON.stringify(encrypted_note?.key),
      content: encrypted_note?.encrypted_content,
    };

    setNoteStatus(NoteStatus.INPROGRESS);

    if (!currentNote) {
      // New note
      const result = await save_note(request).catch((error) => {
        setNoteStatus(NoteStatus.SYNCED);
        handleException(error);
      });
      if (result) {
        const note = {
          content,
          metadata: JSON.parse(metadata),
          key: encrypted_note?.key,
          public: false,
          ...result,
        };
        setCurrentNote(note);
        addToNoteList(note);
      }
    } else {
      // Existing note
      const result = await update_note(currentNote?.id ?? '', request).catch(
        (error) => {
          setNoteStatus(NoteStatus.SYNCED);
          handleException(error);
        }
      );

      if (result) {
        const note = {
          created_at: currentNote?.created_at,
          content,
          metadata: JSON.parse(metadata),
          key: encrypted_note?.key,
          ...result,
        };
        setCurrentNote(note);
        addToNoteList(note);
      }
    }
    setNoteStatus(NoteStatus.SYNCED);
  };
};

export const useGetNoteList = (): (() => Promise<void>) => {
  const [,setAuthStatus] = useAtom(authState);
  const [,setNoteList] = useAtom(noteListState);
  const [userInfo] = useAtom(getUserInfoState);

  return async () => {
    const encrypted_notes = await get_notes().catch((error) => {
      handleException(error);
      setAuthStatus(AuthStatus.SIGNED_OUT);
    });

    if (!encrypted_notes || !userInfo) {
      return;
    }

    const notes = await Promise.allSettled(
      encrypted_notes.map(
        async (note: NoteListItemDto): Promise<NoteListItem> => {
          const key = JSON.parse(note?.key);

          try {
            const decrypted_note = await decrypt_note(key, userInfo?.username, note?.metadata);

            const parsedMetadata = JSON.parse(decrypted_note?.metadata ?? '');

            return {
              key,
              id: note?.id,
              created_at: note?.created_at,
              modified_at: note?.modified_at,
              metadata: parsedMetadata,
            };
          } catch (error) {
            console.error(`Note decryption failure ${note?.id}`);
            return {
              key,
              id: note?.id,
              created_at: note?.created_at,
              modified_at: note?.modified_at,
              metadata: undefined,
            }
          }
        }
      )
    );

    const filteredNotes = notes.map((result: any) => result?.value);
        
    const sortedNotes = sortNotes(filteredNotes);

    setAuthStatus(AuthStatus.SIGNED_IN);
    setNoteList(sortedNotes);
  };
};

export const useGetDeletedNoteList = (): ((
  setDeletedNotes: (notes: Array<DeletedNoteListItem>) => void
) => Promise<void>) => {
  const [userInfo] = useAtom(getUserInfoState);

  return async (
    setDeletedNotes: (notes: Array<DeletedNoteListItem>) => void
  ) => {
    const encrypted_notes = await get_deleted_notes().catch(handleException);

    if (!encrypted_notes || !userInfo) {
      return;
    }

    const notes = await Promise.allSettled(
      encrypted_notes.map(
        async (note: DeletedNoteListItemDto): Promise<DeletedNoteListItem> => {
          const key = JSON.parse(note?.key);
          const decrypted_note = await decrypt_note(key, userInfo?.username, note?.metadata);

          const parsedMetadata = JSON.parse(decrypted_note?.metadata ?? '');

          return {
            key,
            id: note?.id,
            created_at: note?.created_at,
            modified_at: note?.modified_at,
            deleted_at: note?.deleted_at,
            metadata: parsedMetadata,
          };
        }
      )
    );

    const filteredNotes = notes
      .filter(
        (result: PromiseSettledResult<NoteListItem>) =>
          result.status === 'fulfilled'
      )
      .map((result: any) => result?.value);

    const sortedNotes = sortDeletedNotes(filteredNotes);
    setDeletedNotes(sortedNotes);
  };
};
