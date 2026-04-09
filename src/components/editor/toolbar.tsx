'use client';

import type { Editor } from '@tiptap/react';
import { useCallback, useRef } from 'react';
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
  Heading1,
  Heading2,
  Heading3,
  Pilcrow,
  Undo,
  Redo,
  Eraser,
  Palette,
  Highlighter,
  FileUp
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const TEXT_COLORS = [
  '#000000', '#434343', '#666666', '#999999', '#b7b7b7', '#cccccc', '#d9d9d9', '#efefef', '#f3f3f3', '#ffffff',
  '#980000', '#ff0000', '#ff9900', '#ffff00', '#00ff00', '#00ffff', '#4a86e8', '#0000ff', '#9900ff', '#ff00ff',
  '#e6b8af', '#f4cccc', '#fce5cd', '#fff2cc', '#d9ead3', '#d0e0e3', '#c9daf8', '#cfe2f3', '#d9d2e9', '#ead1dc',
];

const HIGHLIGHT_COLORS = [
  'transparent',
  '#f87171', '#fb923c', '#fbbf24', '#a3e635', '#4ade80', '#34d399', '#2dd4bf', '#38bdf8', '#60a5fa', 
  '#818cf8', '#a78bfa', '#c084fc', '#e879f9', '#f472b6'
];
import { useToast } from '@/hooks/use-toast';

interface EditorToolbarProps {
  editor: Editor | null;
  onClearContent: () => void;
}

export function EditorToolbar({ editor, onClearContent }: EditorToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

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

  const handleImportMarkdown = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !editor) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result;
      if (typeof content === 'string') {
        // En Tiptap avec l'extension Markdown, on peut utiliser setContent avec du markdown
        editor.commands.setContent(content, { emitUpdate: true });
        toast({
          title: "Import réussi",
          description: "Le fichier Markdown a été importé avec succès.",
        });
      }
    };
    reader.onerror = () => {
      toast({
        title: "Erreur d'import",
        description: "Impossible de lire le fichier.",
        variant: "destructive",
      });
    };
    reader.readAsText(file);
    
    // Reset input value so same file can be imported again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

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

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Palette className="h-4 w-4" style={{ color: currentColor !== 'var(--foreground)' ? currentColor : 'inherit' }} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-2 bg-popover rounded-md shadow-md border border-border">
          <div className="mb-2 text-xs font-semibold text-muted-foreground px-1">Style de texte</div>
          <div className="flex flex-wrap gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-6 w-6 rounded-sm bg-transparent"
              onClick={() => editor.chain().focus().unsetColor().run()}
              title="Défaut"
            >
              <Eraser className="h-3 w-3" />
            </Button>
            {TEXT_COLORS.map((color) => (
              <button
                key={color}
                className="h-6 w-6 rounded-sm border border-border"
                style={{ backgroundColor: color }}
                onClick={() => editor.chain().focus().setColor(color).run()}
                title={color}
              />
            ))}
          </div>
          <div className="mt-2 flex items-center gap-2 px-1">
             <input
              type="color"
              className="h-6 w-6 cursor-pointer rounded-sm border border-border p-0"
              onInput={(event) => editor.chain().focus().setColor((event.target as HTMLInputElement).value).run()}
              value={currentColor !== 'var(--foreground)' ? currentColor : '#000000'}
             />
             <span className="text-xs text-muted-foreground">Couleur personnalisée</span>
          </div>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Highlighter className="h-4 w-4" style={{ color: currentHighlight !== 'transparent' ? currentHighlight : 'inherit' }} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-2 bg-popover rounded-md shadow-md border border-border">
          <div className="mb-2 text-xs font-semibold text-muted-foreground px-1">Surlignage</div>
          <div className="flex flex-wrap gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-6 w-6 rounded-sm bg-transparent"
              onClick={() => editor.chain().focus().unsetHighlight().run()}
              title="Défaut"
            >
              <Eraser className="h-3 w-3" />
            </Button>
            {HIGHLIGHT_COLORS.filter(color => color !== 'transparent').map((color) => (
              <button
                key={color}
                className="h-6 w-6 rounded-sm border border-border"
                style={{ backgroundColor: color }}
                onClick={() => editor.chain().focus().setHighlight({ color }).run()}
                title={color}
              />
            ))}
          </div>
           <div className="mt-2 flex items-center gap-2 px-1">
             <input
              type="color"
              className="h-6 w-6 cursor-pointer rounded-sm border border-border p-0"
              onInput={(event) => editor.chain().focus().setHighlight({ color: (event.target as HTMLInputElement).value }).run()}
              value={currentHighlight !== 'transparent' ? currentHighlight : '#ffff00'}
             />
             <span className="text-xs text-muted-foreground">Couleur personnalisée</span>
          </div>
        </PopoverContent>
      </Popover>
      
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

      <Separator orientation="vertical" className="h-8" />

      <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()} title="Importer Markdown">
        <FileUp className="h-4 w-4" />
      </Button>
      <input
        type="file"
        accept=".md,.markdown"
        ref={fileInputRef}
        onChange={handleImportMarkdown}
        className="hidden"
      />
    </div>
  );
}
