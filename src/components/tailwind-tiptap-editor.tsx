'use client';

import type { Editor } from '@tiptap/react';
import { useEditor, EditorContent } from '@tiptap/react';

import React, { useState, useEffect } from 'react';
import { EditorToolbar } from './editor/toolbar';
import { getAiAssistance } from '@/app/actions';
import type { AIContentAssistanceOutput } from '@/ai/flows/ai-content-assistance';
import { extensions } from './editor/extensions';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';

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
  const [aiIsLoading, setAiIsLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<AIContentAssistanceOutput | null>(null);
  const [isAiDialogOpen, setIsAiDialogOpen] = useState(false);

  const editor = useEditor({
    extensions,
    content: content,
    editorProps: {
      attributes: {
        class: 'ProseMirror',
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    onDebounceUpdate({ editor }) {
      if (onDebouncedUpdate) {
        onDebouncedUpdate(editor.getHTML());
      }
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, false);
    }
  }, [content, editor]);

  const handleAiAssist = async () => {
    if (!editor) return;

    setAiIsLoading(true);
    try {
      const currentContent = editor.getHTML();
      const result = await getAiAssistance({ content: currentContent });
      setAiSuggestions(result);
      setIsAiDialogOpen(true);
    } catch (error) {
      console.error('AI Assistance Error:', error);
      // You could add a toast notification here to inform the user
    } finally {
      setAiIsLoading(false);
    }
  };

  const applyAiSuggestions = () => {
    if (editor && aiSuggestions) {
      editor.commands.setContent(aiSuggestions.enhancedContent);
      setIsAiDialogOpen(false);
      setAiSuggestions(null);
    }
  };

  const handleClearContent = () => {
    if (editor) {
      editor.chain().focus().clearContent().run();
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <EditorToolbar 
        editor={editor as Editor} 
        onAiAssist={handleAiAssist} 
        aiIsLoading={aiIsLoading}
        onClearContent={handleClearContent}
      />
      <EditorContent editor={editor} />

      <Dialog open={isAiDialogOpen} onOpenChange={setIsAiDialogOpen}>
        <DialogContent className="sm:max-w-3xl h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>AI Content Assistant</DialogTitle>
            <DialogDescription>
              Here are AI-powered suggestions to improve your content. Review the changes and apply them if you're happy.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 min-h-0">
            <div className="flex flex-col gap-2">
              <h3 className="font-semibold">Suggestions</h3>
              <ScrollArea className="border rounded-md p-4 h-full">
                <ul className="space-y-2">
                  {aiSuggestions?.suggestions.map((suggestion, index) => (
                    <li key={index} className="text-sm">{suggestion}</li>
                  ))}
                </ul>
              </ScrollArea>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="font-semibold">Enhanced Content</h3>
              <ScrollArea className="border rounded-md p-4 h-full">
                <div
                  className="prose prose-sm max-w-none dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: aiSuggestions?.enhancedContent || '' }}
                />
              </ScrollArea>
            </div>
          </div>
          <Separator className="my-4" />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAiDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={applyAiSuggestions}>Apply Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
