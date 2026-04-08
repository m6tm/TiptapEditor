'use client';

import type { Editor } from '@tiptap/react';
import { useEditor, EditorContent } from '@tiptap/react';

import React, { useEffect } from 'react';
import { EditorToolbar } from './editor/toolbar';
import { extensions } from './editor/extensions';

interface TailwindTiptapEditorProps {
  content: string;
  onChange: (richText: string) => void;
  onDebouncedUpdate?: (richText: string) => void;
  debounceDuration?: number;
}

export function TailwindTiptapEditor({
  content,
  onChange,
  onDebouncedUpdate,
  debounceDuration = 300,
}: TailwindTiptapEditorProps) {
  const editor = useEditor({
    extensions,
    content: content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'ProseMirror',
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor || !onDebouncedUpdate) return;

    const timeout = setTimeout(() => {
      onDebouncedUpdate(editor.getHTML());
    }, debounceDuration);

    return () => clearTimeout(timeout);
  }, [content, onDebouncedUpdate, debounceDuration, editor]);

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, { emitUpdate: false });
    }
  }, [content, editor]);

  const handleClearContent = () => {
    if (editor) {
      editor.chain().focus().clearContent().run();
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <EditorToolbar 
        editor={editor as Editor} 
        onClearContent={handleClearContent}
      />
      <EditorContent editor={editor} />
    </div>
  );
}
