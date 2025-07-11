"use client"

import type React from "react"

import { Editor } from "@tiptap/core"
import {
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    Quote,
    Code,
    Minus,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Bold,
    Italic,
    Strikethrough,
    Undo,
    Redo,
    Link,
    Unlink,
    AlignJustify,
    Highlighter,
    RotateCcw,
    Code2,
    Sigma,
    Table2,
    TableCellsMerge,
    TableCellsSplit,
    ListTodo,
} from "lucide-react"
import { InsertColumnLeft } from "@/assets/icon-column-add-before"
import { InsertColumnRight } from "@/assets/icon-column-add-after"
import { InsertRowTop } from "@/assets/icon-row-add-above"
import { InsertRowBottom } from "@/assets/icon-row-add-below"
import { DeleteRow } from "@/assets/icon-row-delete"
import { DeleteColumn } from "@/assets/icon-column-delete"
import { DeleteTable } from "@/assets/icon-table-delete"
import { TableFirstColumn } from "@/assets/icon-column-toggle-header"
import { TableHeaderRow } from "@/assets/icon-row-toggle-header"

////////////////////////////////////////////////////////////////////////////////
// Command definitions
////////////////////////////////////////////////////////////////////////////////

/**
 * Represents a command item for the editor toolbar or slash command menu.
 * @property title - The display name of the command.
 * @property description - A short description of the command's action.
 * @property icon - The icon to display for the command.
 * @property enable - Function to determine if the command is enabled for the current editor state.
 * @property command - Function to execute the command.
 * @property isActive - Optional function to determine if the command is currently active.
 */
export interface CommandItem {
    title: string
    description: string
    icon: React.ReactNode
    enable: (opts: { editor: Editor }) => boolean
    command: (opts: { editor: Editor }) => void
    isActive?: (editor: Editor) => boolean
}


/**
 * 2D array of command items grouped for use in toolbars and slash command menus.
 * Each group represents a set of related commands.
 */
export const COMMANDS: CommandItem[][] = [
    [{
        title: "Undo",
        description: "Undo last action",
        icon: <Undo className="h-4 w-4" />,
        enable: ({ editor }) => editor.can().chain().focus().undo().run(),
        command: ({ editor }) => editor.chain().focus().undo().run(),
    },
        {
            title: "Redo",
            description: "Redo last action",
            icon: <Redo className="h-4 w-4" />,
            enable: ({ editor }) => editor.can().chain().focus().redo().run(),
            command: ({ editor }) => editor.chain().focus().redo().run(),
        }],[
        {
            title: "Bold",
            description: "Toggle bold",
            icon: <Bold className="h-4 w-4" />,
            enable: ({ editor }) => editor.can().chain().focus().toggleBold().run(),
            command: ({ editor }) => editor.chain().focus().toggleBold().run(),
            isActive: (editor) => editor.isActive("bold")
        },
        {
            title: "Italic",
            description: "Toggle italic",
            icon: <Italic className="h-4 w-4" />,
            enable: ({ editor }) => editor.can().chain().focus().toggleItalic().run(),
            command: ({ editor }) => editor.chain().focus().toggleItalic().run(),
            isActive: (editor) => editor.isActive("italic")
        },
        {
            title: "Strikethrough",
            description: "Toggle strikethrough",
            icon: <Strikethrough className="h-4 w-4" />,
            enable: ({ editor }) => editor.can().chain().focus().toggleStrike().run(),
            command: ({ editor }) => editor.chain().focus().toggleStrike().run(),
            isActive: (editor) => editor.isActive("strike")
        },
        {
            title: "Inline Code",
            description: "Toggle inline code",
            icon: <Code className="h-4 w-4" />,
            isActive: (editor) => editor.isActive("code"),
            enable: ({ editor }) => editor.can().chain().focus().toggleCode().run(),
            command: ({ editor }) => editor.chain().focus().toggleCode().run(),
        },
        {
            title: "Highlight",
            description: "Toggle highlight",
            icon: <Highlighter className="h-4 w-4" />,
            isActive: (editor) => editor.isActive("highlight"),
            enable: ({ editor }) => editor.can().chain().focus().toggleHighlight().run(),
            command: ({ editor }) => editor.chain().focus().toggleHighlight().run(),
        }],[
        {
            title: "Heading 1",
            description: "Toggle heading level 1",
            icon: <Heading1 className="h-4 w-4" />,
            isActive: (editor) => editor.isActive("heading", { level: 1 }),
            enable: ({ editor }) => editor.can().chain().focus().toggleHeading({ level: 1 }).run(),
            command: ({ editor }) => editor.chain().focus().toggleHeading({ level: 1 }).run(),
        },
        {
            title: "Heading 2",
            description: "Toggle heading level 2",
            icon: <Heading2 className="h-4 w-4" />,
            isActive: (editor) => editor.isActive("heading", { level: 2 }),
            enable: ({ editor }) => editor.can().chain().focus().toggleHeading({ level: 2 }).run(),
            command: ({ editor }) => editor.chain().focus().toggleHeading({ level: 2 }).run(),
        },
        {
            title: "Heading 3",
            description: "Toggle heading level 3",
            icon: <Heading3 className="h-4 w-4" />,
            isActive: (editor) => editor.isActive("heading", { level: 3 }),
            enable: ({ editor }) => editor.can().chain().focus().toggleHeading({ level: 3 }).run(),
            command: ({ editor }) => editor.chain().focus().toggleHeading({ level: 3 }).run(),
        }],[
        {
            title: "Align Left",
            description: "Align text left",
            icon: <AlignLeft className="h-4 w-4" />,
            isActive: (editor) => editor.isActive({ textAlign: "left" }),
            enable: ({ editor }) => editor.can().chain().focus().setTextAlign("left").run(),
            command: ({ editor }) => editor.chain().focus().setTextAlign("left").run(),
        },
        {
            title: "Align Center",
            description: "Align text center",
            icon: <AlignCenter className="h-4 w-4" />,
            isActive: (editor) => editor.isActive({ textAlign: "center" }),
            enable: ({ editor }) => editor.can().chain().focus().setTextAlign("center").run(),
            command: ({ editor }) => editor.chain().focus().setTextAlign("center").run(),
        },
        {
            title: "Align Right",
            description: "Align text right",
            icon: <AlignRight className="h-4 w-4" />,
            isActive: (editor) => editor.isActive({ textAlign: "right" }),
            enable: ({ editor }) => editor.can().chain().focus().setTextAlign("right").run(),
            command: ({ editor }) => editor.chain().focus().setTextAlign("right").run(),
        },
        {
            title: "Justify",
            description: "Justify text",
            icon: <AlignJustify className="h-4 w-4" />,
            isActive: (editor) => editor.isActive({ textAlign: "justify" }),
            enable: ({ editor }) => editor.can().chain().focus().setTextAlign("justify").run(),
            command: ({ editor }) => editor.chain().focus().setTextAlign("justify").run(),
        }],[
        {
            title: "Bullet List",
            description: "Toggle bullet list",
            icon: <List className="h-4 w-4" />,
            isActive: (editor) => editor.isActive("bulletList"),
            enable: ({ editor }) => editor.can().chain().focus().toggleBulletList().run(),
            command: ({ editor }) => editor.chain().focus().toggleBulletList().run(),
        },
        {
            title: "Numbered List",
            description: "Toggle numbered list",
            icon: <ListOrdered className="h-4 w-4" />,
            isActive: (editor) => editor.isActive("orderedList"),
            enable: ({ editor }) => editor.can().chain().focus().toggleOrderedList().run(),
            command: ({ editor }) => editor.chain().focus().toggleOrderedList().run(),
        },{
            title: "Task List",
            description: "Toggle task list",
            icon: <ListTodo className="h-4 w-4" />,
            isActive: (editor) => editor.isActive("taskList"),
            enable: ({ editor }) => editor.can().chain().focus().toggleTaskList().run(),
            command: ({ editor }) => editor.chain().focus().toggleTaskList().run(),
        }],[
        {
            title: "Blockquote",
            description: "Toggle blockquote",
            icon: <Quote className="h-4 w-4" />,
            isActive: (editor) => editor.isActive("blockquote"),
            enable: ({ editor }) => editor.can().chain().focus().toggleBlockquote().run(),
            command: ({ editor }) => editor.chain().focus().toggleBlockquote().run(),
        },
        {
            title: "Code Block",
            description: "Toggle code block",
            icon: <Code2 className="h-4 w-4" />,
            isActive: (editor) => editor.isActive("codeBlock"),
            enable: ({ editor }) => editor.can().chain().focus().toggleCodeBlock().run(),
            command: ({ editor }) => editor.chain().focus().toggleCodeBlock().run(),
        },
        {
            title: "Mathematics",
            description: "Insert mathematics block",
            icon: <Sigma className="h-4 w-4" />,
            enable: ({ editor }) => editor.can().chain().focus().insertContent('$\\\\\\\\$').run(),
            isActive: (editor) => editor.isActive("mathematics"),
            command: ({ editor }) => {
                editor.chain().focus().insertContent('$\\\\\\\\$').run()
                const { state, view } = editor
                const { tr } = state
                const newPos = tr.selection.from - 1
                if (newPos >= 0) {
                    editor.commands.setTextSelection(newPos)
                    if (view) view.focus()
                }
            },
        }],[
        {
            title: "Add Link",
            description: "Add or edit link",
            icon: <Link className="h-4 w-4" />,
            isActive: (editor) => editor.isActive("link"),
            enable: ({ editor }) => editor.can().chain().focus().extendMarkRange("link").run(),
            command: ({ editor }) => {
                const previousUrl = editor.getAttributes("link").href
                const url = window.prompt("URL", previousUrl)
                if (url === null) {
                    editor.commands.focus()
                    return
                }
                if (url === "") {
                    editor.chain().focus().extendMarkRange("link").unsetLink().run()
                    return
                }
                editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
            },
        },
        {
            title: "Remove Link",
            description: "Remove link",
            icon: <Unlink className="h-4 w-4" />,
            enable: ({ editor }) => editor.can().chain().focus().unsetLink().run(),
            command: ({ editor }) => editor.chain().focus().unsetLink().run(),
        }],[
        {
            title: "Add Table",
            description: "Insert table",
            icon: <Table2 className="h-4 w-4" />,
            enable: ({ editor }) => editor.can().chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
            command: ({ editor }) => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
        },
        {
            title: "Add Column Before",
            description: "Add column before",
            icon: <InsertColumnLeft className="h-4 w-4" />,
            enable: ({ editor }) => editor.can().chain().focus().addColumnBefore().run(),
            command: ({ editor }) => editor.chain().focus().addColumnBefore().run(),
        },
        {
            title: "Add Column After",
            description: "Add column after",
            icon: <InsertColumnRight className="h-4 w-4" />,
            enable: ({ editor }) => editor.can().chain().focus().addColumnAfter().run(),
            command: ({ editor }) => editor.chain().focus().addColumnAfter().run(),
        },
        {
            title: "Add Row Before",
            description: "Add row before",
            icon: <InsertRowTop className="h-4 w-4" />,
            enable: ({ editor }) => editor.can().chain().focus().addRowBefore().run(),
            command: ({ editor }) => editor.chain().focus().addRowBefore().run(),
        },
        {
            title: "Add Row After",
            description: "Add row after",
            icon: <InsertRowBottom className="h-4 w-4" />,
            enable: ({ editor }) => editor.can().chain().focus().addRowAfter().run(),
            command: ({ editor }) => editor.chain().focus().addRowAfter().run(),
        },
        {
            title: "Delete Column",
            description: "Delete column",
            icon: <DeleteColumn className="h-4 w-4" />,
            enable: ({ editor }) => editor.can().chain().focus().deleteColumn().run(),
            command: ({ editor }) => editor.chain().focus().deleteColumn().run(),
        },
        {
            title: "Delete Row",
            description: "Delete row",
            icon: <DeleteRow className="h-4 w-4" />,
            enable: ({ editor }) => editor.can().chain().focus().deleteRow().run(),
            command: ({ editor }) => editor.chain().focus().deleteRow().run(),
        },
        {
            title: "Delete Table",
            description: "Delete table",
            icon: <DeleteTable className="h-4 w-4" />,
            enable: ({ editor }) => editor.can().chain().focus().deleteTable().run(),
            command: ({ editor }) => editor.chain().focus().deleteTable().run(),
        },
        {
            title: "Toggle Header Column",
            description: "Toggle header column",
            icon: <TableFirstColumn className="h-4 w-4" />,
            enable: ({ editor }) => editor.can().chain().focus().toggleHeaderColumn().run(),
            command: ({ editor }) => editor.chain().focus().toggleHeaderColumn().run(),
        },
        {
            title: "Toggle Header Row",
            description: "Toggle header row",
            icon: <TableHeaderRow className="h-4 w-4" />,
            enable: ({ editor }) => editor.can().chain().focus().toggleHeaderRow().run(),
            command: ({ editor }) => editor.chain().focus().toggleHeaderRow().run(),
        },
        {
            title: "Merge Cells",
            description: "Merge selected table cells",
            icon: <TableCellsMerge className="h-4 w-4" />,
            enable: ({ editor }) => editor.can().chain().focus().mergeCells().run(),
            command: ({ editor }) => editor.chain().focus().mergeCells().run(),
        },
        {
            title: "Split Cell",
            description: "Split selected table cell",
            icon: <TableCellsSplit className="h-4 w-4" />,
            enable: ({ editor }) => editor.can().chain().focus().splitCell().run(),
            command: ({ editor }) => editor.chain().focus().splitCell().run(),
        }],[
        {
            title: "Horizontal Rule",
            description: "Insert horizontal rule",
            icon: <Minus className="h-4 w-4" />,
            enable: ({ editor }) => editor.can().chain().focus().setHorizontalRule().run(),
            command: ({ editor }) => editor.chain().focus().setHorizontalRule().run(),
        }],[
        {
            title: "Clear Formatting",
            description: "Clear all formatting",
            icon: <RotateCcw className="h-4 w-4" />,
            enable: ({ editor }) => editor.can().chain().focus().unsetAllMarks().run(),
            command: ({ editor }) => editor.chain().focus().unsetAllMarks().run(),
        }]
]
