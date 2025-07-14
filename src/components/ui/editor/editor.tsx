"use client"

import { useEditor, EditorContent, ReactNodeViewRenderer, BubbleMenu } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { Markdown } from "tiptap-markdown"
import Link from "@tiptap/extension-link"
import TextAlign from "@tiptap/extension-text-align"
import Highlight from "@tiptap/extension-highlight"
import { SlashCommand } from "./extenstions/slash-command/slash-command"
import { Toolbar } from "./toolbar"
import { useCallback, useMemo, useState, type PropsWithChildren } from "react"
import { MentionSuggestions } from "./extenstions/mentions/mentions"
import Dropcursor from "@tiptap/extension-dropcursor"
import { Mathematics } from '@tiptap/extension-mathematics'
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { common, createLowlight } from 'lowlight'
import CodeBlockComponent from "./extenstions/code/code-block"
import CommentExtension from "@sereneinserenade/tiptap-comment-extension";
import {Editor, type Extensions} from '@tiptap/core'
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group.tsx"
import { Bold, Italic, Underline } from "lucide-react"
import Placeholder from '@tiptap/extension-placeholder'
import Mention from '@tiptap/extension-mention'
import { Node as ProseMirrorNode } from '@tiptap/pm/model'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import Code from '@tiptap/extension-code'

import 'katex/dist/katex.min.css'
import { Textarea } from "@/components/ui/textarea"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import type { SuggestionOptions } from "@tiptap/suggestion"
import { type CommandItem, COMMANDS } from "./commands"
import { CommentIcon } from "@/assets/icon-comment"
import "./editor.css"

/**
 * Props for the TiptapEditor component.
 * @property content - Initial content for the editor.
 * @property onChange - Callback when the editor content changes.
 * @property placeholder - Placeholder text for the editor.
 * @property codeLanguages - List of supported code languages for syntax highlighting.
 * @property commentOptions - Options for comment integration (set active comment, create new comment).
 * @property mentionsQuery - Function to provide mention suggestions based on a query string.
 */
interface TiptapEditorProps {
    content?: string
    onChange?: (content: string) => void
    placeholder?: string
    codeLanguages?: string[]
    commentOptions?: {
        setActiveCommentId: (id: string) => void;
        createNewCommentAndReturnId: () => Promise<string>;
    }
    mentionsQuery?: (query: string) => string[];
    editable?: boolean;
    className?: string;
}

/**
 * A Simple & ready-to-use rich text editor using Tiptap and various extensions.
 * Supports Markdown, code blocks, comments, mentions, and more.
 *
 * @param props - See TiptapEditorProps for details.
 * @returns The editor UI.
 */
export function TiptapEditor({
                                 content = "",
                                 onChange,
                                 placeholder,
                                 codeLanguages,
                                 commentOptions,
                                 mentionsQuery,
                                 editable=true,
                                 className = "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none",
                                 children
                             }: PropsWithChildren<TiptapEditorProps>)
{
    const [isMarkdownMode, setIsMarkdownMode] = useState(false)

    // create a lowlight instance
    const lowlight = createLowlight(codeLanguages ? {} : common)
    if (codeLanguages) {
        codeLanguages?.forEach((s) => {
            if (s in common) {
                lowlight.register(s, common[s])
            }
        })
    }

    let extensions: Extensions = [
        StarterKit.configure({
            bulletList: {
                keepMarks: true,
                keepAttributes: false,
            },
            orderedList: {
                keepMarks: true,
                keepAttributes: false,
            },
            blockquote: {
                HTMLAttributes: {
                    class: "border-l-4 pl-4 italic  my-4",
                },
            },
            codeBlock: {
                HTMLAttributes: {
                    class: "border rounded-md p-4 font-mono text-sm my-4 overflow-x-auto",
                },
            },
            code: {
                HTMLAttributes: {
                    class: "px-1.5 py-0.5 rounded text-sm font-mono ",
                },
            },
        }),
        Code.configure({
            HTMLAttributes: {
                class: 'bg-gray-300 not-prose px-1.5 py-0.5 rounded text-sm font-mono',
            },
        }),
        TaskList,
        TaskItem.configure({
            nested: true,
        }),
        Placeholder.configure({
            placeholder: placeholder,
        }),
        CodeBlockLowlight
            .extend({
                addAttributes() {
                    return { raw: isMarkdownMode }
                },
                addNodeView() {
                    return ReactNodeViewRenderer(CodeBlockComponent)
                },
            })
            .configure({ lowlight }),
        Mathematics,
        Table.configure({
            resizable: true,
        }),
        TableRow,
        TableHeader,
        // Custom TableCell with backgroundColor attribute
        TableCell,
        Markdown.configure({
            html: false,
            transformCopiedText: true,
            transformPastedText: true,
        }),
        Link.configure({
            openOnClick: false,
            HTMLAttributes: {
                class: "underline cursor-pointer",
            },
        }),
        TextAlign.configure({
            types: ["heading", "paragraph"],
        }),
        Highlight.configure({
            multicolor: true,
        }),
        SlashCommand,
        Dropcursor.configure({
            /*color: '#000000',*/
        })
    ]
    if (commentOptions) {
        extensions = [
            ...extensions,
            CommentExtension.configure({
                HTMLAttributes: {
                    class: 'my-comment'
                },
                onCommentActivated: commentOptions.setActiveCommentId
            })
        ]
    }
    if (mentionsQuery) {
        extensions = [
            ...extensions,
            Mention.extend({
                renderMarkdown({ node, suggestion }: { node: ProseMirrorNode, suggestion: SuggestionOptions}) {
                    return `${suggestion?.char ?? '@'}${node.attrs.label ?? node.attrs.id}`
                }
            }).configure({
                HTMLAttributes: {
                    class: 'mention',
                },
                suggestion: MentionSuggestions(mentionsQuery),
            }),

        ]
    }
    const editor = useEditor({
        shouldRerenderOnTransaction: true,
        extensions: extensions,
        content: content,
        editable: editable,
        enableInputRules: editable,
        enablePasteRules: editable,
        editorProps: {
            attributes: {
                class: className
            },
        },
        onUpdate: ({ editor }) => {
            const markdown = editor.storage.markdown.getMarkdown()
            console.log(markdown)
            onChange?.(markdown)
        },
    })

    const toggleMarkdownMode = () => {
        if (!editor) return
        setIsMarkdownMode((v) => !v)
    }
    let bubbleAction: Record<string, () => void> = {
        'bold': () => editor?.chain().focus().toggleBold().run(),
        'italic': () => editor?.chain().focus().toggleItalic().run(),
        'strike': () => editor?.chain().focus().toggleStrike().run(),
    }
    if (commentOptions) {
        bubbleAction = {...bubbleAction, 'comment': () => setCommentCommand()}
    }

    const bubbleCallback = (newState: string[]) => {
        Object.keys(bubbleAction).forEach((s: string) => {
            if (newState.includes(s) !== editor?.isActive(s)){
                bubbleAction[s]();
            }
        })
    }

    const setCommentCommand: () => Promise<void> = useCallback(async () => {
        if (commentOptions) {
            const newCommentId = await commentOptions.createNewCommentAndReturnId()
            editor?.commands.setComment(newCommentId)
            commentOptions.setActiveCommentId(newCommentId)
        }
    }, [editor?.commands, commentOptions]);

    const editorCommandItems = useMemo<CommandItem[][]>(() => {
        return [...COMMANDS, [{
            title: "Comment",
            description: "Comment",
            icon: <CommentIcon className="h-4 w-4" />,
            enable: (_opts: { editor: Editor }) => true,
            command: setCommentCommand
        }]]
    }, [setCommentCommand]);

    if (!editor) {
        return null
    }

    return (
        <div className="w-full max-w-none">
            <div className="border rounded-lg overflow-hidden shadow-sm">
                <Toolbar
                    editor={editor}
                    isMarkdownMode={isMarkdownMode}
                    onToggleMarkdown={toggleMarkdownMode}
                    editorCommandItems={editorCommandItems}
                />
                <div className="min-h-[300px]">
                    <Textarea
                        value={editor.storage.markdown.getMarkdown()}
                        onChange={(e) => editor.commands.setContent(e.target.value)}
                        className="min-h-[300px] p-5 "
                        hidden={!isMarkdownMode}/>
                    { children && commentOptions ?
                        <EditorResizableWithComments editor={editor} hidden={isMarkdownMode}>
                            {children}
                        </EditorResizableWithComments>
                        :
                        <EditorBasic editor={editor} hidden={isMarkdownMode}/>
                    }
                    {editor && <BubbleMenu className="bubble-menu" tippyOptions={{ duration: 100 }} editor={editor}>
                        <ToggleGroup variant="default" type="multiple"
                                     onValueChange={bubbleCallback}
                                     value={Object.keys(bubbleAction).filter((s) => editor.isActive(s))}
                        >
                            <ToggleGroupItem
                                value="bold"
                                aria-label="Toggle bold"
                            >
                                <Bold className="h-4 w-4" />
                            </ToggleGroupItem>
                            <ToggleGroupItem
                                value="italic"
                                aria-label="Toggle italic">
                                <Italic className="h-4 w-4" />
                            </ToggleGroupItem>
                            <ToggleGroupItem
                                value="strike"
                                aria-label="Toggle strikethrough">
                                <Underline className="h-4 w-4" />
                            </ToggleGroupItem>
                        </ToggleGroup>
                    </BubbleMenu>
                    }
                </div>
                <div className="border-t px-4 py-2 text-xs">
                    {isMarkdownMode ? "Markdown Mode" : "Rich Text Mode"} • {content.length || 0}{" "}
                    characters
                </div>
            </div>
        </div>
    )
}

interface EditorResizableWithCommentsProps {
    editor: Editor;
    hidden: boolean;
}

const EditorResizableWithComments = (props: PropsWithChildren<EditorResizableWithCommentsProps>) => {
    return (
        <ResizablePanelGroup direction="horizontal">
            <ResizablePanel>
                <EditorContent editor={props.editor} className="min-h-[300px] p-5 " hidden={props.hidden}/>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel>
                {props.children}
            </ResizablePanel>
        </ResizablePanelGroup>
    )
}

const EditorBasic = (props: EditorResizableWithCommentsProps) => {
    return (
        <EditorContent editor={props.editor} className="min-h-[300px] p-5 " hidden={props.hidden}/>
    )
}