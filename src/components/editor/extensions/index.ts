import { StarterKit } from '@tiptap/starter-kit';
import { Markdown } from 'tiptap-markdown';
import CustomLink from './link';
import CustomPlaceholder from './placeholder';
import TextStyle from './text-style';
import Color from './color';
import Highlight from './highlight';


export const extensions = [
  StarterKit.configure({
    blockquote: true,
    bold: true,
    bulletList: true,
    codeBlock: true,
    document: true,
    dropcursor: true,
    gapcursor: true,
    hardBreak: true,
    heading: true,
    history: true,
    horizontalRule: true,
    italic: true,
    listItem: true,
    orderedList: true,
    paragraph: true,
    strike: true,
    text: true,
  }),
  Markdown,
  CustomLink,
  CustomPlaceholder,
  TextStyle,
  Color,
  Highlight.configure({ multicolor: true }),
];
