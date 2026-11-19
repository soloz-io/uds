import type { FileStatus } from "./FileStatusBadge";
import type { IconName } from "@/registry/icons";

export interface FileItem {
  id: string;
  name: string;
  path?: string;
  icon?: IconName;
  iconColor?: string;
  /** Set false to render as a non-interactive display row (disables click, keyboard select, and hover highlight) */
  clickable?: boolean;
}

export interface FileGroup {
  id: string;
  title: string;
  icon?: IconName;
  iconColor?: string;
  files: FileItem[];
  defaultOpen?: boolean;
}

export interface FileQueueProps {
  groups: FileGroup[];
  selectedFileId?: string;
  onFileSelect?: (fileId: string) => void;
  className?: string;
}

export interface FileChangeData {
  id: string;
  filename: string;
  status: FileStatus;
  path: string;
}
