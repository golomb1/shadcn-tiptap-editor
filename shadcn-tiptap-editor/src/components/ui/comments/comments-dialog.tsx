"use client"

import { useState, type KeyboardEvent } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"


export interface CreateCommentDialogResult {
    username: string
    content: string
}


export interface CreateCommentDialogProps {
    name: string
    open: boolean
    onOpenChange: (v: boolean) => void;
    onSubmit?: (result: CreateCommentDialogResult) => void;
    onCancel?: () => void;
    allowToModifyUsername: boolean;
}

export default function CreateCommentDialog(props: CreateCommentDialogProps) {
    const [name, setName] = useState(props.name)
    const [content, setContent] = useState("")

    const handleSave = () => {
        if (props.onSubmit) {
            props.onSubmit({username: name, content})
        }
        // Reset form and close the dialog.
        setName("")
        setContent("")
    }

    const handleCancel = () => {
        // Reset form and close the dialog.
        setName("")
        setContent("")
    }

    const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === "Enter") {
            event.preventDefault();
            handleSave();
        }
    }

    return (
        <div className="flex h-screen items-center justify-center">
            <Dialog open={props.open} onOpenChange={props.onOpenChange}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Create New Comment</DialogTitle>
                        <DialogDescription>
                            Write your name and the content for your comment. Click save when you're done.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" placeholder="Enter name..." disabled={!props.allowToModifyUsername} value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="content">Content</Label>
                            <Textarea
                                autoFocus
                                id="content"
                                placeholder="Enter content..."
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                rows={4}
                                onKeyDown={onKeyDown}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave} disabled={!name.trim() || !content.trim()}>
                            Save
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

