"use client"

import type { Editor } from "@tiptap/react"
import { Separator } from "@/components/ui/separator"
import {
    FileText,
    Eye,
} from "lucide-react"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { type CommandItem } from "./commands"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

interface ToolbarProps {
    editor: Editor
    isMarkdownMode: boolean
    onToggleMarkdown: () => void
    editorCommandItems: CommandItem[][]
}

export function Toolbar({ editor, isMarkdownMode, onToggleMarkdown, editorCommandItems }: ToolbarProps) {
    if (!editor) {
        return null
    }
    return (
        <>
            <ToggleGroup
                variant="default"
                type="multiple"
                className="border-b p-2 flex items-center gap-1 flex-wrap"
            >
                {
                    editorCommandItems.map((section) => section.map((item: CommandItem) =>
                        <Tooltip key={`tooltip-${item.title}`}>
                            <TooltipTrigger asChild>
                                <ToggleGroupItem
                                    size="sm"
                                    className="h-8 w-8 min-w-8"
                                    data-state={item.isActive && item.isActive(editor) ? 'on': 'closed'}
                                    value={item.title}
                                    aria-label={item.description}
                                    disabled={!item.enable({editor})}
                                    onClick={() => item.command({editor})}>
                                    {item.icon}
                                </ToggleGroupItem>
                            </TooltipTrigger>
                            <TooltipContent>
                                {item.description}
                            </TooltipContent>
                        </Tooltip>
                    )).flatMap((subArray, index, array) => {
                        if (index < array.length - 1) {
                            return [...subArray, <Separator key={index} orientation="vertical" className="h-6 mx-1" />];
                        } else {
                            return subArray;
                        }
                    })
                }
                <Separator orientation="vertical" className="h-6 mx-1" />

                {/* Markdown Toggle */}
                <ToggleGroupItem
                    value="markdown"
                    onClick={onToggleMarkdown}
                    title={isMarkdownMode ? "Switch to Rich Text" : "Switch to Markdown"}
                >
                    {isMarkdownMode ? <Eye className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                </ToggleGroupItem>

            </ToggleGroup>
            <Separator orientation="horizontal"/>
        </>
    )
}
