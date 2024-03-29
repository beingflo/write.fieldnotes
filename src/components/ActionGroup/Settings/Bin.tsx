import { useAtom } from 'jotai';
import React from 'react';
import { useGetDeletedNoteList, useGetNoteList } from '../../../api/hooks';
import { undelete_note } from '../../../api/note_api';
import { BinIcon, RefreshIcon, SadIcon } from '../../../icons';
import { DeletedNoteListItem } from '../../../types';
import { getDeletedNoteListState } from '../../state';

export const Bin = (): React.ReactElement => {
  const getNoteList = useGetNoteList();
  const getDeletedNoteList = useGetDeletedNoteList();

  const [deletedNotes] = useAtom(getDeletedNoteListState);

  const recover_note = (id: string) => {
    undelete_note(id).then(() => {
      getDeletedNoteList();
      getNoteList();
    });
  };

  return (
    <>
      <ul className='space-y-4'>
        {deletedNotes?.length === 0 ? (
          <div className='flex flex-col items-center text-gray-600'>
            <SadIcon className='h-16 w-16' />
            <div>Nothing here</div>
          </div>
        ) : (
          deletedNotes?.map((note: DeletedNoteListItem) => (
            <li key={note?.id} className='flex flex-col'>
              <span className='truncate font-semibold'>
                {note?.metadata?.title}
              </span>
              <div className='flex justify-between'>
                <div className='flex flex-row space-x-1'>
                  <BinIcon className='h-4 w-4 self-center stroke-2' />
                  <span className='text-gray-500'>
                    {new Date(note?.deleted_at).toLocaleDateString()}
                  </span>
                </div>
                <button onClick={() => recover_note(note?.id)}>
                  <RefreshIcon className='h-4 w-4' />
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </>
  );
};

export default Bin;
