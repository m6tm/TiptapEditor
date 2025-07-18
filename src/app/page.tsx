'use client';
import { useState, useEffect } from 'react';
import { TailwindTiptapEditor } from '@/components/tailwind-tiptap-editor';
import parserHtml from 'prettier/parser-html';
import prettier from 'prettier/standalone';

export default function Home() {
  const [content, setContent] = useState<string>(
    `<h1>Welcome to the Tailwind Tiptap Editor!</h1><p>This is a modern, reusable, and customizable rich text editor built with <a href="https://tiptap.dev">TipTap</a> and styled with <a href="https://tailwindcss.com">Tailwind CSS</a>.</p><p>Feel free to edit this content. Use the toolbar above to format your text. You can make text <strong>bold</strong>, <em>italic</em>, or <del>strikethrough</del>.</p><h3>Key Features:</h3><ul><li>Modern UI/UX with a clean, intuitive interface.</li><li>Easily customizable plugin architecture.</li><li>AI-powered content assistance. Try the ✨ button!</li></ul><blockquote>Give it a try and see how easy it is to create beautiful content.</blockquote><pre><code>console.log("Hello, World!");</code></pre>`
  );
  const [formattedContent, setFormattedContent] = useState('');

  useEffect(() => {
    const formatHtml = async () => {
      try {
        const formatted = await prettier.format(content, {
          parser: 'html',
          plugins: [parserHtml],
          htmlWhitespaceSensitivity: 'css',
        });
        setFormattedContent(formatted);
      } catch (error) {
        console.error('HTML formatting error:', error);
        setFormattedContent(content); // Fallback to unformatted content on error
      }
    };
    formatHtml();
  }, [content]);

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-12 lg:p-24 bg-background">
      <div className="w-full max-w-4xl mx-auto space-y-8">
        <header className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl font-headline">
            Tailwind Tiptap Editor
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
        
        <div className="bg-card p-4 sm:p-6 rounded-xl shadow-lg border">
          <h2 className="text-2xl font-semibold mb-4 font-headline">Live HTML Output</h2>
          <div className="bg-muted p-4 rounded-lg overflow-x-auto">
            <pre className="text-sm whitespace-pre-wrap break-words">
              <code>{formattedContent}</code>
            </pre>
          </div>
        </div>
      </div>
    </main>
  );
}
