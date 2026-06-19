import type { FileStatus } from "./FileStatusBadge";

export interface FileItem {
  id: string;
  name: string;
  path?: string;
  icon?: string;
  iconColor?: string;
}

export interface FileGroup {
  id: string;
  title: string;
  icon?: string;
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
