import { useAtom } from 'jotai';
import React from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { currentNoteState, getEditorState, noteStatusState } from '../state';
import { NewIcon } from '../../icons';
import { NoteStatus } from '../../types';
import { useLocation } from 'wouter';

export const NewAction = (): React.ReactElement => {
  const [editor] = useAtom(getEditorState);
  const [, setNoteStatus] = useAtom(noteStatusState);
  const [, setCurrentNote] = useAtom(currentNoteState);
  const [, setLocation] = useLocation();

  const handleNew = React.useCallback(() => {
    // If unsaved, handle gracefully
    setNoteStatus(NoteStatus.SYNCED);

    editor?.commands.setContent('');
    editor?.commands?.focus();

    setCurrentNote(undefined);
    setLocation('/');
  }, [editor, setLocation, setCurrentNote, setNoteStatus]);

  useHotkeys(
    'command+e,ctrl+e',
    (event: KeyboardEvent) => {
      handleNew();
      event.preventDefault();
    },
    { enableOnContentEditable: true },
    [handleNew]
  );

  return (
    <div>
      <button onClick={handleNew}>
        <NewIcon className='h-7 w-7 text-black transition hover:-translate-x-0.5 active:scale-90 sm:h-6 sm:w-6' />
      </button>
    </div>
  );
};
