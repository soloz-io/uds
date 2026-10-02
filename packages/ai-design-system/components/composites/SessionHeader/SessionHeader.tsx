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
import { formatDayLabel } from '@/lib/date';


export interface SessionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  /**
   * What a session is called.
   * - "title": the session's own title (default).
   * - "date": the day it was created, as "21 Aug 2025", in the reader's time
   *   zone. For a surface that keeps one session per day, where the day is
   *   what tells sessions apart and a first message is not.
   * @default "title"
   */
  titleFormat?: 'title' | 'date';
  /**
   * IANA time zone for "date" titles. Defaults to the reader's own.
   */
  timeZone?: string;
  sessions?: ChatSessionInfo[];
  activeSessionId?: string | null;
  onNewSession?: () => void;
  onCloseSession?: (id: string) => void;
  onSelectSession?: (id: string) => void;
  onDownloadSession?: () => Promise<FileDownloadResult | undefined>;
  showActions?: boolean;
  showNewSession?: boolean;
  showDownloadSession?: boolean;
  /**
   * Handler to switch to editor/overview in mobile view
   */
  onOverview?: () => void;
  /**
   * Whether to show the overview button in the session header
   * @default true
   */
  showOverview?: boolean;
}

/**
 * SessionHeader Composite
 *
 * A header for managing chat sessions, including title display, new session creation,
 * and a dropdown history of past sessions.
 */
export const SessionHeader = React.forwardRef<HTMLDivElement, SessionHeaderProps>(
  ({ title, titleFormat = 'title', timeZone, sessions, activeSessionId, onNewSession, onCloseSession, onSelectSession, onDownloadSession, showActions = true, showNewSession = true, showDownloadSession = true, onOverview, showOverview = true, className, ...props }, ref) => {
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

    const byDate = titleFormat === 'date';
    const sessionLabel = (session: ChatSessionInfo | undefined): string => {
      if (!byDate) return session?.title || 'Untitled Session';
      // A session not yet in the list is the one being started now: today's.
      return formatDayLabel(session?.created_at ?? new Date(), { timeZone }) || 'Untitled Session';
    };

    const displayTitle = title || (activeSessionId
      ? sessionLabel(activeSession)
      : byDate ? formatDayLabel(new Date(), { timeZone }) : 'New Session');

    return (
      <div 
        ref={ref}
        className={`flex flex-none items-center justify-between px-4 py-2 border-b border-border bg-background ${className || ""}`}
        {...props}
      >
        <div className="flex items-center space-x-2 overflow-hidden">
          <span className="text-sm font-medium truncate">
            {displayTitle}
          </span>
        </div>
        {showActions && (
          <div className="flex items-center space-x-1 flex-none">
            {Boolean(onOverview && showOverview !== false) && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onOverview}
                className="h-8 w-8 md:hidden"
                aria-label="Overview"
              >
                <Icon name="overview" className="h-4 w-4" />
              </Button>
            )}
            {Boolean(onDownloadSession && showDownloadSession) && (
              <Button variant="ghost" size="icon" onClick={handleDownloadClick} className="h-8 w-8" title="Download Chat History">
                <Icon name="download" className="h-4 w-4" />
              </Button>
            )}
            {Boolean(onNewSession && showNewSession) && (
              <Button variant="ghost" size="icon" onClick={onNewSession} className="h-8 w-8" title="New Session">
                <Icon name="plus" className="h-4 w-4" />
              </Button>
            )}
            
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
                      <span className="text-sm font-medium truncate w-full">{sessionLabel(session)}</span>
                      {/* The date is the title in "date" mode; repeating it underneath says nothing. */}
                      {!byDate && (
                        <span className="text-xs text-muted-foreground">{new Date(session.created_at).toLocaleString()}</span>
                      )}
                    </DropdownMenuItem>
                  ))
                ) : (
                  <div className="p-4 text-sm text-center text-muted-foreground">No previous sessions</div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            <a ref={downloadRef} style={{ display: 'none' }} />
          </div>
        )}
      </div>
    );
  }
);

SessionHeader.displayName = "SessionHeader";
