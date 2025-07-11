"use client";
import { useState, type Dispatch, type SetStateAction, useCallback, useEffect } from "react";
import CreateCommentDialog, { type CreateCommentDialogProps, type CreateCommentDialogResult } from "./comments-dialog";
import CommentSection from "./comments-section";
import type { Comment } from "./comments-datatype";
import { v4 } from 'uuid';



/**
 * Default function for creating a new comment object.
 * @param username - The name of the comment author.
 * @param content - The content of the comment.
 * @returns A new Comment object.
 */
export const defaultNewComment = (username: string, content: string): Comment => {
    return {
        id: `comment-${v4()}`,
        name: username,
        content: content,
        replies: [] as Comment[],
        creationTime: new Date(),
        resolved: false
    }
}


/**
 * Options for creating the comment dialog.
 */
type CreateCommentDialogOptions = Omit<CreateCommentDialogProps, "open" | "onOpenChange" | "onSubmit" | "onCancel">;
/**
 * Hook for showing a confirmation dialog for creating comments.
 * @returns An object with showConfirm (promise-based dialog) and ConfirmDialogComponent (JSX component).
 */

export function useConfirmDialog() {
    const [isOpen, setIsOpen] = useState(false);
    const [resolvePromise, setResolvePromise] = useState<(value: CreateCommentDialogResult | null) => void>();
    const [rejectPromise, setRejectPromise] = useState<() => void>();
    const [dialogOptions, setDialogOptions] = useState<CreateCommentDialogOptions | null>(null);

    const showConfirm = (options: CreateCommentDialogOptions): Promise<CreateCommentDialogResult> => {
        setDialogOptions(options);
        setIsOpen(true);
        return new Promise((resolve, reject) => {
            setResolvePromise(() => resolve);
            setRejectPromise(() => reject);
        });
    };

    const handleConfirm = (value: CreateCommentDialogResult) => {
        resolvePromise?.(value);
        setIsOpen(false);
    };

    const handleCancel = () => {
        resolvePromise?.(null);
        setIsOpen(false);
    };

    const handleOpenChange = (open: boolean) => {
        if (!open && rejectPromise) { // Dialog closed without explicit action
            rejectPromise();
        }
        setIsOpen(open);
    };

    const ConfirmDialogComponent = () => (
        <CreateCommentDialog
            allowToModifyUsername={dialogOptions?.allowToModifyUsername ?? false}
            name={dialogOptions?.name ?? ""}
            open={isOpen}
            onOpenChange={handleOpenChange}
            onSubmit={handleConfirm}
            onCancel={handleCancel} />
    );

    return { showConfirm, ConfirmDialogComponent };
}
/**
 * Parameters for the useCommentSection hook.
 */

export interface CommentSectionParams {
    username?: string;
    comments?: Comment[];
    setComments?: Dispatch<SetStateAction<Comment[]>>;
    templateForNewComment?: (userId: string, content: string) => Comment;
    allowToModifyUsername?: boolean;
}
/**
 * Hook for managing comment section state and logic, including dialog integration.
 * @param userId - the username of the current user.
 * @param templateForNewComment - a function for creating a new comment object.
 * @param allowToModifyUsername - specified if the user can edit his username.
 * @param params - See CommentSectionParams for details.
 * @returns An object with setActiveId, createNewComment, and CommentSectionComponent.
 */

export function useCommentSection({
                                      username = 'You', templateForNewComment = defaultNewComment, allowToModifyUsername = false, ...params
                                  }: CommentSectionParams) {
    const [internalComments, setInternalComments] = useState<Comment[]>([]);
    const [activeId, setActiveId] = useState<string | null>(null);
    const comments = params.comments ?? internalComments;
    const setComments = params.setComments ?? setInternalComments;

    const { showConfirm, ConfirmDialogComponent } = useConfirmDialog();

    const CommentSectionComponent = useCallback(() => <>
            <CommentSection
                comments={comments}
                setComments={setComments}
                username={username}
                createNewComment={templateForNewComment}
                activeId={activeId}
                setActiveId={setActiveId} />
            <ConfirmDialogComponent />
        </>,
        [activeId, comments, setComments, templateForNewComment, username, ConfirmDialogComponent]);

    const createNewComment = useCallback(async () => {
        const result = await showConfirm({ name: username, allowToModifyUsername });
        const controller = new AbortController();
        if (!result) {
            controller.abort('Cancelled operation');
        }
        const comment = templateForNewComment(result.username, result.content);
        setComments((o) => [comment, ...o]);
        return comment.id;
    }, [username, showConfirm, setComments, templateForNewComment, allowToModifyUsername]);

    useEffect(() => {
        console.log("activeId", activeId);
    }, [activeId]);

    return {
        setActiveId,
        createNewComment,
        CommentSectionComponent
    };
}
