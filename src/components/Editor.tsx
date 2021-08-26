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
import { useCurrentNote } from '../context/currentNoteReducer';
import './editorStyles.css';

export const Editor = (): React.ReactElement => {
  const note = useCurrentNote();
  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight,
      Typography,
      Placeholder.configure({
        placeholder: 'Write something nice ...',
      }),
      TextStyle,
      Link,
      Image,
      Table,
      TableCell,
      TableRow,
      TableHeader,
    ],
    autofocus: 'end',
    editable: true,
    content: '',
    editorProps: {
      attributes: {
        class:
          'prose prose-sm md:prose py-6 px-2 focus:outline-none min-h-screen',
      },
    },
  });

  React.useEffect(() => {
    editor?.commands?.setContent(note?.content ?? '');
  }, [note]);

  return <EditorContent editor={editor} />;
};

export default Editor;