import StarterKit from '@tiptap/starter-kit';

const CustomStarterKit = StarterKit.configure({
  heading: {
    levels: [1, 2, 3],
  },
  history: true, // Keep history for undo/redo
});

export default CustomStarterKit;
