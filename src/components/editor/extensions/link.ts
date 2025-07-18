import Link from '@tiptap/extension-link';

const CustomLink = Link.configure({
  openOnClick: false,
  autolink: true,
  linkOnPaste: true,
});

export default CustomLink;
