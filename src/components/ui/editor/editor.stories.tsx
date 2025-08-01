import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { TiptapEditor } from './editor';
import { useCommentSection } from "../comments/use-comment-section";
import { type Comment } from '../comments/comments-datatype';
import { useForm} from 'react-hook-form';
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";

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

export const ReadOnlyMode: Story = {
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
        content: '# Read-Only Editor\n\nThis editor is **not editable**. The toolbar and bubble menu are hidden.\n\n- No editing allowed\n- Clean display\n- Perfect for viewing content',
        placeholder: 'This content cannot be edited...',
        editable: false
    },
};

export const WithoutToolbar: Story = {
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
        content: '# Editor Without Toolbar\n\nThis editor is editable but has no toolbar. You can still:\n\n- Type and edit text\n- Use the bubble menu for formatting\n- Use keyboard shortcuts\n- Use slash commands',
        placeholder: 'Start typing...',
        editable: false
    },
};

export const CustomStyled: Story = {
    render: (args) => {
        const [content, setContent] = useState(args.content || '');
        return (
            <div className="max-w-4xl mx-auto">
                <TiptapEditor
                    {...args}
                    content={content}
                    onChange={setContent}
                />
            </div>
        );
    },
    args: {
        content: '# Custom Styled Editor\n\nThis editor demonstrates custom className styling with wider container.',
        placeholder: 'Write in a custom styled container...',
        className: "prose prose-lg max-w-none focus:outline-none text-gray-800"
    },
};

export const ControlledEditor: Story = {
    render: (args) => {
        const [content, setContent] = useState(args.content || '');

        return (
            <div className="max-w-4xl mx-auto space-y-6">
                <TiptapEditor
                    {...args}
                    content={content}
                    onChange={setContent}
                />
                <p>{content}</p>
            </div>
        );
    },
    args: {
        placeholder: 'Write your article content here...',
        content: '# Getting Started\n\nWrite your article content here...',
    },
};

const FormDataSchema = z.object({
    content: z.string()
})

type FormData = z.infer<typeof FormDataSchema>

export const EditorUpdatesForm: Story = {
    render: (args) => {
        const form = useForm<FormData>({
            resolver: zodResolver(FormDataSchema),
            defaultValues: { content: '' }
        })

        const handleSubmit = (data: FormData) => {
            console.log(data)
            form.reset()
        }

        return (
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Content</FormLabel>
                                <FormControl>
                                    <TiptapEditor
                                        {...args}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                </form>
            </Form>
            );
    },
    args: {
        placeholder: 'Start writing your article...',
        content: '# My First Article\n\nThis is an example article about #technology and #programming.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.\n\n#webdev #react #tiptap',
    },
};

