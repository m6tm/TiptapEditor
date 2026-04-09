import { StarterKit } from '@tiptap/starter-kit';
import { Markdown } from 'tiptap-markdown';
import CustomLink from './link';
import CustomPlaceholder from './placeholder';
import TextStyle from './text-style';
import Color from './color';
import Highlight from './highlight';


export const extensions = [
  StarterKit.configure({
    blockquote: {},
    bold: {},
    bulletList: {},
    codeBlock: {},
    document: {},
    dropcursor: {},
    gapcursor: {},
    hardBreak: {},
    heading: {},
    history: {},
    horizontalRule: {},
    italic: {},
    listItem: {},
    orderedList: {},
    paragraph: {},
    strike: {},
    text: {},
  }),
  Markdown,
  CustomLink,
  CustomPlaceholder,
  TextStyle,
  Color,
  Highlight.configure({ multicolor: true }),
];
