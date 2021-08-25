import React from 'react';
import { useNoteList } from '../context/noteListReducer';
import { NoteListEntry } from '../types';
import '../style.css';
import { useAppDispatch } from '../context';
import { get_note } from '../api/note_api';
import { useCurrentNote } from '../context/currentNoteReducer';

export type Props = {
  setHide: () => void;
};

export const Sidebar = ({ setHide }: Props): React.ReactElement => {
  const notes = useNoteList();
  const currentNote = useCurrentNote();
  const dispatch = useAppDispatch();
  const [query, setQuery] = React.useState('');

  const filteredNotes = notes.filter((note: NoteListEntry) => {
    const metainfo: { title: string; tags: string } = JSON.parse(
      note?.metainfo
    );

    // TODO more sophisticated searching (fuzzy, multiword, etc)
    return metainfo?.title?.includes(query) || metainfo?.tags?.includes(query);
  });

  const isSelected = React.useCallback(
    (id: string) => currentNote?.id === id,
    [currentNote]
  );

  const handleSelection = React.useCallback((id: string) => {
    get_note(id, dispatch);
    setHide();
  }, []);

  return (
    <div className="px-6 w-full pt-4 pb-6">
      <div className="flex flex-row align-middle">
        <button className="pr-2" onClick={() => setHide()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 17l-5-5m0 0l5-5m-5 5h12"
            />
          </svg>
        </button>
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search"
            value={query}
            onChange={(event) => setQuery(event?.target?.value)}
            className="border-none focus:ring-0 placeholder-gray-400 bg-gray-100 rounded-lg w-full"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 absolute top-2 right-2 text-gray-400 cursor-pointer"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>
      <ul className="space-y-0.5 pl-9 pt-4">
        {filteredNotes.map((note: NoteListEntry) => (
          <li
            onClick={() => handleSelection(note?.id)}
            key={note?.id}
            id={note?.id}
            className="cursor-pointer truncate"
          >
            <span className={`${isSelected(note?.id) ? 'highlight' : ''}`}>
              {JSON.parse(note?.metainfo)?.title}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
