# shadcn-tiptap-editor

A simple & ready-to-use rich text editor built with [Tiptap](https://tiptap.dev/) and [shadcn/ui](https://ui.shadcn.com/), featuring Markdown support, code blocks, comments, mentions, tables, and more. This project is designed for easy integration into React applications and provides a modern, extensible editing experience.

## Example

You can interact with a live Storybook demo of the TiptapEditor component here:

[Live Storybook: TiptapEditor](https://golomb1.github.io/shadcn-tiptap-editor/)

## Features

- **Rich Text Editing**: Powered by Tiptap and ProseMirror, supporting all standard formatting.
- **Markdown Mode**: Toggle between rich text and markdown editing.
- **Code Blocks**: Syntax highlighting for multiple languages using `lowlight`.
- **Comments**: Inline comment support via the `@sereneinserenade/tiptap-comment-extension`.
- **Mentions**: Customizable mention suggestions and rendering.
- **Tables**: Advanced table editing with resizing and custom cell attributes.
- **Task Lists**: Support for checklists and nested tasks.
- **Mathematics**: Inline and block math rendering with KaTeX.
- **Slash Commands**: Quick command menu for inserting elements.
- **Customizable Toolbar**: Easily extend or modify the editor's toolbar and commands.
- **Read-Only Mode**: Editor can be set to read-only mode with toolbar and bubble menu hidden.
- **Resizable Panels**: Editor and comments panel can be resized for better UX.
- **Theming**: Styled with Tailwind CSS and shadcn/ui components for a modern look.

## Getting Started

### Installation

```bash
npm install shadcn-tiptap-editor
# or
yarn add shadcn-tiptap-editor
```

### Usage

```tsx
import { TiptapEditor } from 'shadcn-tiptap-editor';

function MyEditor() {
  return (
    <TiptapEditor
      content="Hello, world!"
      onChange={markdown => console.log(markdown)}
      placeholder="Start typing..."
      codeLanguages={['js', 'ts', 'python']}
      commentOptions={{
        setActiveCommentId: (id) => { /* ... */ },
        createNewCommentAndReturnId: async () => { /* ... */ return 'id'; }
      }}
      mentionsQuery={query => [/* ...suggestions... */]}
    />
  );
}
```

### Props

- `content` (string): Initial content for the editor.
- `onChange` (function): Callback when the editor content changes (returns Markdown).
- `placeholder` (string): Placeholder text for the editor.
- `codeLanguages` (string[]): Supported code languages for syntax highlighting.
- `commentOptions` (object): Options for comment integration.
- `mentionsQuery` (function): Function to provide mention suggestions.
- `editable` (boolean): Whether the editor is editable (default: true). When false, toolbar and bubble menu are hidden.
- `className` (string): Custom CSS classes for the editor content area.

## Storybook Examples

The project includes comprehensive Storybook stories demonstrating various use cases:

- **Default**: Basic editor with placeholder
- **WithContent**: Editor with pre-populated content
- **WithMarkdown**: Editor with markdown syntax examples
- **WithAllComponents**: Comprehensive demo of all features
- **Mention**: Editor with mention functionality
- **CommentsPanel**: Editor with resizable comments panel
- **CommentsOutside**: Editor with comments section below
- **ReadOnlyMode**: Non-editable editor for display purposes
- **WithoutToolbar**: Editor without toolbar but with bubble menu
- **CustomStyled**: Editor with custom styling and container

## Development

- **Storybook**: Run `npm run storybook` to view and develop components in isolation.
- **Build**: `npm run build` to build the library.
- **Lint**: `npm run lint` to check code quality.

## License

ISC

## Author

[Tomer Golomb](https://github.com/golomb1)
