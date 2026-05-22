/**
 * FileQueue Block
 *
 * Central export point for the FileQueue block component and its related types.
 */
export { FileQueue } from "./FileQueue";
export type { FileQueueProps, FileGroup, FileItem, FileChangeData } from "./interfaces";

// Legacy exports for backward compatibility (used by RefinementPanel)
export { FileStatusBadge } from "./FileStatusBadge";
export type { FileStatusBadgeProps, FileStatus } from "./FileStatusBadge";
