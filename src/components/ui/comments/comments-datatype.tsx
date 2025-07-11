/**
 * Represents a single comment, which may have nested replies.
 * @property id - Unique identifier for the comment.
 * @property name - Name of the comment author.
 * @property creationTime - Date and time when the comment was created.
 * @property content - The text content of the comment.
 * @property replies - Array of replies to this comment (nested comments).
 * @property resolved - Whether the comment is marked as resolved.
 */
export interface Comment {
    id: string
    name: string
    creationTime: Date
    content: string
    replies: Comment[]
    resolved: boolean;
}
