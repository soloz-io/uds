import * as React from "react";
import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator 
} from "@/components/primitives/DropdownMenu";

export interface ChatSessionInfo {
  id: string;
  title: string;
  created_at: string;
}

import type { FileDownloadResult } from '@/components/composites/FileTreeExplorer';


export interface SessionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  sessions?: ChatSessionInfo[];
  activeSessionId?: string | null;
  onNewSession?: () => void;
  onCloseSession?: (id: string) => void;
  onSelectSession?: (id: string) => void;
  onDownloadSession?: () => Promise<FileDownloadResult | undefined>;
}

/**
 * SessionHeader Composite
 *
 * A header for managing chat sessions, including title display, new session creation,
 * and a dropdown history of past sessions.
 */
export const SessionHeader = React.forwardRef<HTMLDivElement, SessionHeaderProps>(
  ({ sessions, activeSessionId, onNewSession, onCloseSession, onSelectSession, onDownloadSession, className, ...props }, ref) => {
    const activeSession = sessions?.find(s => s.id === activeSessionId);
    const downloadRef = React.useRef<HTMLAnchorElement>(null);

    const handleDownloadClick = React.useCallback(async () => {
      if (!onDownloadSession) return;
      const result = await onDownloadSession();
      if (!result) return;
      const url = URL.createObjectURL(result.blob);
      const anchor = downloadRef.current;
      if (anchor) {
        anchor.href = url;
        anchor.download = result.filename;
        anchor.click();
      }
      URL.revokeObjectURL(url);
    }, [onDownloadSession]);

    return (
      <div 
        ref={ref}
        className={`flex flex-none items-center justify-between px-4 py-2 border-b border-border bg-background ${className || ""}`}
        {...props}
      >
        <div className="flex items-center space-x-2 overflow-hidden">
          <span className="text-sm font-medium truncate">
            {activeSessionId 
              ? (activeSession?.title || 'Untitled Session')
              : 'New Session'}
          </span>
        </div>
        <div className="flex items-center space-x-1 flex-none">
          {onDownloadSession && (
            <Button variant="ghost" size="icon" onClick={handleDownloadClick} className="h-8 w-8" title="Download Chat History">
              <Icon name="download" className="h-4 w-4" />
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={onNewSession} className="h-8 w-8" title="New Session">
            <Icon name="plus" className="h-4 w-4" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Icon name="clock" className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 max-h-80 overflow-y-auto">
              <DropdownMenuLabel>Chat History</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {sessions && sessions.length > 0 ? (
                sessions.map((session) => (
                  <DropdownMenuItem 
                    key={session.id}
                    onClick={() => onSelectSession?.(session.id)}
                    className="flex flex-col items-start py-2 cursor-pointer"
                  >
                    <span className="text-sm font-medium truncate w-full">{session.title || 'Untitled Session'}</span>
                    <span className="text-xs text-muted-foreground">{new Date(session.created_at).toLocaleString()}</span>
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="p-4 text-sm text-center text-muted-foreground">No previous sessions</div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          <a ref={downloadRef} style={{ display: 'none' }} />
        </div>
      </div>
    );
  }
);

SessionHeader.displayName = "SessionHeader";
