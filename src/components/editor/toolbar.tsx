'use client';

import type { Editor } from '@tiptap/react';
import { useCallback } from 'react';
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  Quote,
  Minus,
  Link as LinkIcon,
  Sparkles,
  Heading1,
  Heading2,
  Heading3,
  LoaderCircle,
  Pilcrow,
  Undo,
  Redo,
  Eraser,
  Palette,
  Highlighter
} from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface EditorToolbarProps {
  editor: Editor | null;
  onAiAssist: () => void;
  aiIsLoading: boolean;
  onClearContent: () => void;
}

export function EditorToolbar({ editor, onAiAssist, aiIsLoading, onClearContent }: EditorToolbarProps) {
  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) {
      return;
    }
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  const currentColor = editor.getAttributes('textStyle').color || 'var(--foreground)';
  const currentHighlight = editor.getAttributes('highlight').color || 'transparent';

  return (
    <div className="flex flex-wrap items-center gap-1 rounded-md border border-input bg-transparent p-1">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="w-24 text-left justify-start">
             {editor.isActive('heading', { level: 1 }) && <Heading1 className="h-4 w-4 mr-2" />}
             {editor.isActive('heading', { level: 2 }) && <Heading2 className="h-4 w-4 mr-2" />}
             {editor.isActive('heading', { level: 3 }) && <Heading3 className="h-4 w-4 mr-2" />}
             {(!editor.isActive('heading')) && <Pilcrow className="h-4 w-4 mr-2" />}
            <span>
              {editor.isActive('heading', { level: 1 }) ? 'Heading 1' : 
               editor.isActive('heading', { level: 2 }) ? 'Heading 2' :
               editor.isActive('heading', { level: 3 }) ? 'Heading 3' : 'Paragraph'
              }
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => editor.chain().focus().setParagraph().run()}>Paragraph</DropdownMenuItem>
          <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>Heading 1</DropdownMenuItem>
          <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>Heading 2</DropdownMenuItem>
          <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>Heading 3</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Separator orientation="vertical" className="h-8" />
      
      <Toggle size="sm" pressed={editor.isActive('bold')} onPressedChange={() => editor.chain().focus().toggleBold().run()}>
        <Bold className="h-4 w-4" />
      </Toggle>
      <Toggle size="sm" pressed={editor.isActive('italic')} onPressedChange={() => editor.chain().focus().toggleItalic().run()}>
        <Italic className="h-4 w-4" />
      </Toggle>
      <Toggle size="sm" pressed={editor.isActive('strike')} onPressedChange={() => editor.chain().focus().toggleStrike().run()}>
        <Strikethrough className="h-4 w-4" />
      </Toggle>

      <Separator orientation="vertical" className="h-8" />

      <Button variant="ghost" size="icon" asChild className="relative h-9 w-9">
        <label>
          <Palette className="h-4 w-4" style={{ color: currentColor }}/>
          <input
            type="color"
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
            onInput={(event) => editor.chain().focus().setColor((event.target as HTMLInputElement).value).run()}
            value={currentColor}
          />
        </label>
      </Button>
      
      <Button variant="ghost" size="icon" asChild className="relative h-9 w-9">
        <label>
          <Highlighter className="h-4 w-4" style={{ color: currentHighlight === 'transparent' ? 'var(--foreground)' : currentHighlight }}/>
          <input
            type="color"
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
            onInput={(event) => editor.chain().focus().toggleHighlight({ color: (event.target as HTMLInputElement).value }).run()}
            value={currentHighlight}
          />
        </label>
      </Button>
      
      <Separator orientation="vertical" className="h-8" />

      <Toggle size="sm" pressed={editor.isActive('bulletList')} onPressedChange={() => editor.chain().focus().toggleBulletList().run()}>
        <List className="h-4 w-4" />
      </Toggle>
      <Toggle size="sm" pressed={editor.isActive('orderedList')} onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}>
        <ListOrdered className="h-4 w-4" />
      </Toggle>
      <Toggle size="sm" pressed={editor.isActive('blockquote')} onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}>
        <Quote className="h-4 w-4" />
      </Toggle>
      <Toggle size="sm" pressed={editor.isActive('codeBlock')} onPressedChange={() => editor.chain().focus().toggleCodeBlock().run()}>
        <Code className="h-4 w-4" />
      </Toggle>

      <Separator orientation="vertical" className="h-8" />

      <Button variant="ghost" size="icon" onClick={setLink} className={editor.isActive('link') ? 'is-active' : ''}>
        <LinkIcon className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        <Minus className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="h-8" />
      
      <Button variant="ghost" size="icon" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
        <Undo className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
        <Redo className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={onClearContent}>
        <Eraser className="h-4 w-4" />
      </Button>
      
      <div className="flex-grow" />
      
      <Button variant="ghost" size="sm" onClick={onAiAssist} disabled={aiIsLoading}>
        {aiIsLoading ? (
          <LoaderCircle className="h-4 w-4 animate-spin mr-2" />
        ) : (
          <Sparkles className="h-4 w-4 text-accent-foreground mr-2" />
        )}
        AI Assist
      </Button>
    </div>
  );
}
