import React from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import Typography from '@tiptap/extension-typography';
import Placeholder from '@tiptap/extension-placeholder';
import TextStyle from '@tiptap/extension-text-style';
import Link from '@tiptap/extension-link';
import Table from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import Image from '@tiptap/extension-image';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Underline from '@tiptap/extension-underline';
import './editorStyles.css';
import { editorState, getCurrentNoteState, noteStatusState } from './state';
import { NoteStatus } from '../types';
import { useAtom } from 'jotai';
import SelectionMenu from './SelectionMenu';
import TextAlign from '@tiptap/extension-text-align';

export const Editor = (): React.ReactElement => {
  const [note] = useAtom(getCurrentNoteState);
  const [, setEditor] = useAtom(editorState);
  const [, setNoteStatus] = useAtom(noteStatusState);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight.configure({
        HTMLAttributes: {
          class: 'bg-yellow-300 p-0.5 rounded-sm',
        },
      }),
      Underline,
      Typography,
      Placeholder.configure({
        placeholder: 'Write something nice ...',
      }),
      TextStyle,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link,
      Image,
      Table.configure({
        resizable: false,
      }),
      TableCell,
      TableRow,
      TableHeader,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
    ],
    autofocus: 'end',
    editable: true,
    content: '',
    editorProps: {
      scrollThreshold: 40,
      scrollMargin: 40,
      attributes: {
        class:
          'prose prose-headings:font-semibold prose-h1:tracking-tight prose-p:text-gray-800 marker:text-gray-800 prose-pre:bg-gray-800 prose-pre:rounded-sm pt-6 pb-16 md:pt-10 px-2 focus:outline-none min-h-full',
      },
    },
    onUpdate() {
      setNoteStatus(NoteStatus.CHANGED);
    },
  });

  React.useEffect(() => {
    if (editor?.getHTML() !== note?.content) {
      editor?.commands?.setContent(note?.content ?? '');
    }
  }, [note]);

  React.useEffect(() => {
    setEditor(editor);
  }, [editor]);

  return (
    <>
      <SelectionMenu editor={editor} />
      <EditorContent className='h-full' editor={editor} />
    </>
  );
};

export default Editor;
