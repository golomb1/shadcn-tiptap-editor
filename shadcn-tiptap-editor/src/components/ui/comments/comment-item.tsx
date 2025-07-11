"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { MessageCircle, Check, Edit } from 'lucide-react'
import type { Comment } from "./comments-datatype"
import {type KeyboardEvent, useState} from "react"
import { Textarea } from "@/components/ui/textarea"

export function formatTimeAgo(date: Date): string {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) {
        return "just now"
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60)
    if (diffInMinutes < 60) {
        return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`
    }

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) {
        return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`
    }

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) {
        return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`
    }

    return date.toLocaleDateString()
}


interface CommentItemProps {
    comment: Comment
    depth?: number
    onReply?: (commentId: string) => void
    onToggleResolved?: (commentId: string) => void
    onUpdateComment?: (commentId: string, newContent: string) => void
    selectComment: (id: string) => void;
    activeCommentId: string | null;
}

export function CommentItem({
                                comment,
                                depth = 0,
                                onReply,
                                onToggleResolved,
                                onUpdateComment,
                                selectComment,
                                activeCommentId
                            }: CommentItemProps) {
    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((word) => word[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
    }

    const maxDepth = 3 // Limit nesting depth
    const isMaxDepth = depth >= maxDepth
    const [edit, setEdit] = useState(false);
    const [editContent, setEditContent] = useState(comment.content);

    function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
        if (onUpdateComment && event.key === "Enter") {
            onUpdateComment(comment.id, editContent)
            setEdit(false)
        } else if (event.key === "Escape") {
            setEditContent(comment.content)
            setEdit(false)
        }
    }
    return (
        <div className={`${depth > 0 ? "ml-6 border-l-2 border-gray-100 pl-4" : ""} ${activeCommentId === comment.id ? "border-1 border-blue-200 rounded-sm" : ""}`} onClick={()=>selectComment(comment.id)}>
            <div className={`flex gap-3 ${comment.resolved ? "opacity-60" : ""}`}>
                <Avatar className="h-10 w-10 flex-shrink-0">
                    <AvatarFallback className="text-xs">{getInitials(comment.name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                        <h4 className={`font-semibold text-sm ${comment.resolved ? "line-through" : ""}`}>{comment.name}</h4>
                        {comment.resolved && (
                            <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                                <Check className="h-3 w-3" />
                                Resolved
                            </div>
                        )}
                        <span className="text-xs text-muted-foreground">{formatTimeAgo(comment.creationTime)}</span>
                        <Button variant="ghost" size="sm" className="ml-auto h-6 w-6 p-0" onClick={() => onUpdateComment && setEdit(true)}>
                            <Edit className="h-4 w-4" />
                        </Button>
                    </div>
                    { !edit ?
                        (<p className={`text-sm text-muted-foreground leading-relaxed ${comment.resolved ? "line-through" : ""}`}>
                            {comment.content}
                        </p>)
                        :
                        (<Textarea autoFocus onKeyDown={handleKeyDown} value={editContent} onChange={(e) => setEditContent(e.target.value)}/>)
                    }
                    <div className="flex items-center gap-4 pt-1">
                        {!isMaxDepth && (
                            <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" onClick={() => onReply?.(comment.id)}>
                                <MessageCircle className="h-3 w-3 mr-1" />
                                Reply
                            </Button>
                        )}
                        <Button
                            variant="ghost"
                            size="sm"
                            className={`h-8 px-2 text-xs ${comment.resolved ? "text-green-600" : ""}`}
                            onClick={() => onToggleResolved?.(comment.id)}
                        >
                            <Check className="h-3 w-3 mr-1" />
                            {comment.resolved ? "Unresolved" : "Mark Resolved"}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Render nested replies */}
            {comment.replies && comment.replies.length > 0 && (
                <div className="mt-4 space-y-4">
                    {comment.replies.map((reply) => (
                        <CommentItem
                            activeCommentId={activeCommentId}
                            selectComment={() => selectComment(reply.id)}
                            key={reply.id}
                            comment={reply}
                            depth={depth + 1}
                            onReply={onReply}
                            onToggleResolved={onToggleResolved}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
