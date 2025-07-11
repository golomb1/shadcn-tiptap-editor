"use client"

import { useState, type Dispatch, type KeyboardEvent, type SetStateAction } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { MessageCircle } from "lucide-react"
import type { Comment } from "./comments-datatype"
import { CommentItem } from "./comment-item"
import { Filter } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

/**
 * Props for the CommentSection component.
 * @property username - The name of the current user.
 * @property comments - The list of comments to display.
 * @property setComments - Setter for updating the comment list.
 * @property createNewComment - Function to create a new comment object.
 * @property activeId - The ID of the currently active comment.
 * @property setActiveId - Setter for updating the active comment ID.
 */
export interface CommentSectionProps {
    username: string
    comments?: Comment[]
    setComments?: Dispatch<SetStateAction<Comment[]>>
    createNewComment: (user: string, content: string) => Comment
    activeId: string | null
    setActiveId: Dispatch<SetStateAction<string | null>>
}

/**
 * CommentSection component for displaying and managing a list of comments.
 * Supports adding, replying, resolving, and filtering comments.
 *
 * @param props - See CommentSectionProps for details.
 * @returns The comment section UI.
 */
export default function CommentSection(props: CommentSectionProps) {
    const [newComment, setNewComment] = useState("")
    const [filter, setFilter] = useState<"all" | "resolved" | "unresolved">("all")

    // Sample data matching your Comment interface
    const [internalComments, setInternalComments] = useState<Comment[]>([])

    const comments = props.comments ?? internalComments;
    const setComments = props.setComments ?? setInternalComments;
    const getTotalCommentCount = (comments: Comment[]): number => {
        return comments.reduce((total, comment) => {
            return total + 1 + getTotalCommentCount(comment.replies)
        }, 0)
    }

    const filterComments = (comments: Comment[]): Comment[] => {
        const filterRecursive = (comment: Comment): Comment | null => {
            const filteredReplies = comment.replies.map(filterRecursive).filter((reply): reply is Comment => reply !== null)

            const matchesFilter =
                filter === "all" ||
                (filter === "resolved" && comment.resolved) ||
                (filter === "unresolved" && !comment.resolved)

            if (matchesFilter || filteredReplies.length > 0) {
                return {
                    ...comment,
                    replies: filteredReplies,
                }
            }

            return null
        }

        return comments.map(filterRecursive).filter((comment): comment is Comment => comment !== null)
    }

    const filteredComments = filterComments(comments)


    const handleAddComment = () => {
        if (newComment.trim()) {
            const comment: Comment = {
                id: Date.now().toString(),
                name: "You", // In a real app, this would come from user auth
                creationTime: new Date(),
                content: newComment.trim(),
                replies: [],
                resolved: false,
            }
            setComments((o) => [comment, ...o])
            setNewComment("")
        }
    }

    const handleReply = (commentId: string | number) => {
        const newComment = props.createNewComment(props.username, '')
        setComments((o) => o.map((c) => c.id === commentId ? {...c, replies: [newComment, ...c.replies], resolved: false} : c))
    }

    const handleToggleResolved = (commentId: string | number) => {
        const toggleResolvedRecursive = (comments: Comment[]): Comment[] => {
            return comments.map((comment) => {
                if (comment.id === commentId) {
                    return { ...comment, resolved: !comment.resolved }
                }
                return {
                    ...comment,
                    replies: toggleResolvedRecursive(comment.replies),
                }
            })
        }
        setComments(toggleResolvedRecursive(comments))
    }

    const handleUpdateComment = (commentId: string, newContent: string) => {
        setComments((o) => o.map((c) => c.id === commentId ? {...c, content: newContent} : c))
    }

    const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === "Enter") {
            event.preventDefault();
            handleAddComment();
        }
    }

    return (
        <Card className="w-full max-w-2xl">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <MessageCircle className="h-5 w-5" />
                        Comments ({getTotalCommentCount(filteredComments)})
                    </CardTitle>
                    <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        <Select value={filter} onValueChange={(value: "all" | "resolved" | "unresolved") => setFilter(value)}>
                            <SelectTrigger className="w-32">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="resolved">Resolved</SelectItem>
                                <SelectItem value="unresolved">Unresolved</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Add Comment Form */}
                <div className="space-y-3">
                    <div className="flex gap-3">
                        <Avatar className="h-8 w-8">
                            <AvatarFallback>YU</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-3">
                            <Textarea
                                placeholder="Write a comment..."
                                className="min-h-[80px] resize-none"
                                value={newComment}
                                onKeyDown={onKeyDown}
                                onChange={(e) => setNewComment(e.target.value)}
                            />
                            <div className="flex justify-end">
                                <Button size="sm" onClick={handleAddComment} disabled={!newComment.trim()}>
                                    Post Comment
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Comments List */}
                <div className="space-y-6">
                    {filteredComments.map((comment) => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            onReply={handleReply}
                            onToggleResolved={handleToggleResolved}
                            onUpdateComment={handleUpdateComment}
                            selectComment={props.setActiveId}
                            activeCommentId={props.activeId}
                        />
                    ))}
                </div>

                {filteredComments.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                        {filter === "all" ? "No comments yet. Be the first to comment!" : `No ${filter} comments found.`}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}