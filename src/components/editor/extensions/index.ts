import { StarterKit } from '@tiptap/starter-kit';
import { Markdown } from 'tiptap-markdown';
import CustomLink from './link';
import CustomPlaceholder from './placeholder';
import TextStyle from './text-style';
import Color from './color';
import Highlight from './highlight';


export const extensions = [
  StarterKit.configure({
    link: false,
  }),
  Markdown.configure({
    linkify: true,
    transformPastedText: true,
    transformCopiedText: true,
  }),
  CustomLink,
  CustomPlaceholder,
  TextStyle,
  Color,
  Highlight.configure({ multicolor: true }),
];
