'use client';
import { useState } from 'react';
import { TailwindTiptapEditor } from '@/components/tailwind-tiptap-editor';

export default function Home() {
  const [content, setContent] = useState<string>(
`# Welcome to Tiptap Pro Editor!

This is a modern, reusable, and customizable rich text editor built with [TipTap](https://tiptap.dev) and styled with [Tailwind CSS](https://tailwindcss.com).

Feel free to edit this content. Use the toolbar above to format your text. You can make text **bold**, *italic*, or ~~strikethrough~~.

### Key Features:

- Modern UI/UX with a clean, intuitive interface.
- Easily customizable plugin architecture.
- Open-source and highly flexible.

> Give it a try and see how easy it is to create beautiful content.

\`\`\`javascript
console.log("Hello, World!");
\`\`\``
  );

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-12 lg:p-24 bg-background">
      <div className="w-full max-w-4xl mx-auto space-y-8">
        <header className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl font-headline">
            Tiptap Pro Editor
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            A modern, reusable, and customizable rich text editor.
          </p>
        </header>

        <div className="bg-card p-2 sm:p-4 rounded-xl shadow-lg border">
          <TailwindTiptapEditor
            content={content}
            onChange={(newContent: string) => setContent(newContent)}
          />
        </div>
      </div>
    </main>
  );
}
