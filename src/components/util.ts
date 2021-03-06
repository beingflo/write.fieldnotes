import React from 'react';
import { DeletedNoteListItem, NoteListItem } from '../types';

const NOTE_VERSION = 1;
const DEFAULT_TITLE = 'Untitled note';

export const getMetadata = (content: string | undefined): string => {
  const title = new DOMParser().parseFromString(content ?? '', 'text/html');
  const trimmedTitle =
    title.body.firstElementChild?.textContent || DEFAULT_TITLE;

  return JSON.stringify({
    title: trimmedTitle,
    tags: '',
    version: NOTE_VERSION,
  });
};

export const useFocus = (): any => {
  const htmlElRef = React.useRef(null);
  const setFocus = () => {
    //@ts-ignore
    htmlElRef?.current && htmlElRef?.current?.focus();
  };

  return [htmlElRef, setFocus];
};

export const sortNotes = (notes: Array<NoteListItem>): Array<NoteListItem> => {
  return notes?.sort((a, b) => {
    const dateA = new Date(a?.modified_at);
    const dateB = new Date(b?.modified_at);

    if (dateA < dateB) {
      return 1;
    } else if (dateA > dateB) {
      return -1;
    }
    return 0;
  });
};

export const sortDeletedNotes = (
  notes: Array<DeletedNoteListItem>
): Array<DeletedNoteListItem> => {
  return notes?.sort((a, b) => {
    const dateA = new Date(a?.deleted_at);
    const dateB = new Date(b?.deleted_at);

    if (dateA < dateB) {
      return 1;
    } else if (dateA > dateB) {
      return -1;
    }
    return 0;
  });
};
