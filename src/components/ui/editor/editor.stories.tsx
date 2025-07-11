import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { TiptapEditor } from './editor';
import { useCommentSection } from "../comments/use-comment-section";
import { type Comment } from '../comments/comments-datatype';

const meta = {
    title: 'Editor/TiptapEditor',
    component: TiptapEditor,
    parameters: {
        layout: 'padded'
    },
    argTypes: {
        content: { control: 'text' },
        placeholder: { control: 'text' },
        commentOptions: {  },
    },
} satisfies Meta<typeof TiptapEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: (args) => {
        const [content, setContent] = useState(args.content || '');
        return (
            <TiptapEditor
                {...args}
                content={content}
                onChange={setContent}
            />
        );
    },
    args: {
        placeholder: 'Start writing...'
    },
};

export const WithContent: Story = {
    render: (args) => {
        const [content, setContent] = useState(args.content || '');
        return (
            <TiptapEditor
                {...args}
                content={content}
                onChange={setContent}
            />
        );
    },
    args: {
        content: 'Hello, **Tiptap**!\n\n- List item 1\n- List item 2',
        placeholder: 'Start writing...'
    },
};

export const WithMarkdown: Story = {
    render: (args) => {
        const [content, setContent] = useState(args.content || '');
        return (
            <TiptapEditor
                {...args}
                content={content}
                onChange={setContent}
            />
        );
    },
    args: {
        content: '# Markdown Example\n\n```js\nconsole.log("Hello, world!");\n```',
        placeholder: 'Write some markdown...'
    },
};

export const WithAllComponents: Story = {
    render: (args) => {
        const [content, setContent] = useState(args.content || '');
        return (
            <TiptapEditor
                {...args}
                content={content}
                onChange={setContent}
            />
        );
    },
    args: {
        content: `
# H1

## H2 

### H3

Left

Center

Right

Justify items

- Bullet list 1
- Bullet list 2

1. Number list 1
2. Number list 2

> Quote

\`\`\`javascript
console.log('Hello World')
\`\`\`

[This is link to Google](https://google.com)

| TH1 | TH2 | TH3 |
| --- | --- | --- |
| C1 | C2 | C3 |
| C4 | C5 | C6 |
`,
        placeholder: 'Write some markdown...'
    },
};

const MENTION_LIST = [
    "Alice",
    "Bob",
    "Charlie",
    "Diana",
    "Ethan",
    "Fiona",
    "Grace",
    "Henry",
    "Isabella",
    "Jack"
];

export const Mention: Story = {
    render: (args) => {
        const [content, setContent] = useState(args.content || '');
        return (
                <TiptapEditor
                    {...args}
                    content={content}
                    onChange={setContent}
                />
        );
    },
    args: {
        content: '# Mention Example\n\nTry to write "\@"',
        placeholder: 'Write some markdown...',
        mentionsQuery :(q)=> MENTION_LIST.filter((s) => s.toLowerCase().includes(q.toLocaleLowerCase()))
    },
};

export const CommentsPanel: Story = {
    render: (args) => {
        const [content, setContent] = useState(args.content || '');
        const [comments, setComments] = useState<Comment[]>([]);
        const {setActiveId, createNewComment, CommentSectionComponent} = useCommentSection({username: 'TG', comments, setComments})
        return (
                <TiptapEditor
                    {...args}
                    content={content}
                    onChange={setContent}
                    commentOptions={{
                        createNewCommentAndReturnId: createNewComment,
                        setActiveCommentId: setActiveId,
                    }}
                >
                    <CommentSectionComponent/>
                </TiptapEditor>
        );
    },
    args: {
        content: '# Markdown Example\n\n```js\nconsole.log("Hello, world!");\n```',
        placeholder: 'Write some markdown...',
    },
};


export const CommentsOutside: Story = {
    render: (args) => {
        const [content, setContent] = useState(args.content || '');
        const [comments, setComments] = useState<Comment[]>([]);
        const {setActiveId, createNewComment, CommentSectionComponent} = useCommentSection({username: 'TG', comments, setComments})

        return (
            <div className='flex flex-col w-full gap-4'>
                <TiptapEditor
                    {...args}
                    content={content}
                    onChange={setContent}
                    commentOptions={{
                        createNewCommentAndReturnId: createNewComment,
                        setActiveCommentId: setActiveId,
                    }}
                />
                <CommentSectionComponent />
            </div>
        );
    },
    args: {
        content: '# Markdown Example\n\n```js\nconsole.log("Hello, world!");\n```',
        placeholder: 'Write some markdown...',
    },
};
