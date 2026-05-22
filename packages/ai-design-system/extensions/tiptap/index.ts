/**
 * Tiptap Extensions for AI Editor
 * 
 * Custom Mark and Node extensions for annotation rendering
 */

export { CommentMark } from './CommentMark'
export type { CommentMarkAttributes } from './CommentMark'

export { PendingCommentMark } from './PendingCommentMark'

export {
  SuggestionInsertMark,
  SuggestionDeleteMark,
  SuggestionModifyMark,
} from './SuggestionMark'
export type { SuggestionMarkAttributes } from './SuggestionMark'

export { BlockAdditionNode } from './BlockAdditionNode'
export type { BlockAdditionNodeAttributes } from './BlockAdditionNode'
