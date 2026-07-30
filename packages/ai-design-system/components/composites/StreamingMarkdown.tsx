import { type ComponentProps, memo, useState, useCallback } from "react";
import { Streamdown, defaultRemarkPlugins } from "streamdown";
import { Icon } from "@/components/primitives/Icon";
import remarkFrontmatter from "remark-frontmatter";

const customRemarkPlugins = [
  ...Object.values(defaultRemarkPlugins),
  remarkFrontmatter,
];

export type StreamingMarkdownProps = ComponentProps<typeof Streamdown> & {
  title?: string;
  description?: string;
  type?: string;
  status?: string;
};
/**
 * A composite component that wraps Streamdown with all configured plugins.
 * Features should import this component instead of importing Streamdown directly.
 */
export const StreamingMarkdown = memo(
  ({
    remarkPlugins,
    children,
    title: propsTitle,
    description: propsDescription,
    type: propsType,
    status: propsStatus,
    controls: propsControls,
    ...props
  }: StreamingMarkdownProps) => {
    const [copied, setCopied] = useState(false);
    let content = children;
    let title = propsTitle;
    let description = propsDescription;
    let type = propsType;
    let status = propsStatus;

    const handleCopy = useCallback(async () => {
      if (typeof content !== "string" || !content) return;
      try {
        await navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy content:", err);
      }
    }, [content]);

    const handleDownload = useCallback(() => {
      if (typeof content !== "string" || !content) return;
      const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${(title || "document").toLowerCase().replace(/\s+/g, "-")}.md`;
      anchor.click();
      URL.revokeObjectURL(url);
    }, [content, title]);
    
    // Strip and parse YAML frontmatter to prevent Streamdown from splitting it into standard markdown blocks.
    if (typeof content === "string" && content.startsWith("---\n")) {
      const endMatch = content.indexOf("\n---\n", 4);
      if (endMatch !== -1) {
        const frontmatterText = content.slice(4, endMatch);
        content = content.slice(endMatch + 5);
        
        // Simple YAML parsing for top-level keys
        const fm: Record<string, string> = {};
        frontmatterText.split("\n").forEach((line) => {
          const colonIdx = line.indexOf(":");
          if (colonIdx !== -1) {
            const key = line.slice(0, colonIdx).trim();
            let value = line.slice(colonIdx + 1).trim();
            // Remove quotes if present
            if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
              value = value.slice(1, -1);
            }
            fm[key] = value;
          }
        });

        if (!title && fm.title) title = fm.title;
        if (!description && fm.description) description = fm.description;
        if (!type && fm.type) type = fm.type;
        if (!status && fm.status) status = fm.status;
      } else {
        // Still streaming frontmatter, hide it
        content = "";
      }
    }

    const hasHeader = title || description || type || status;

    return (
      <div className="flex w-full flex-col">
        {hasHeader && (
          <div className="mb-6 flex w-full flex-col border-b border-border pb-4">
            <div className="flex w-full items-start justify-between gap-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  {title && (
                    <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                      {title}
                    </h1>
                  )}
                  {type && (
                    <span className="inline-flex items-center rounded-md border border-border bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                      {type}
                    </span>
                  )}
                  {status && (
                    <span className="inline-flex items-center rounded-md border border-transparent bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      {status}
                    </span>
                  )}
                </div>
                {description && (
                  <p className="text-sm text-muted-foreground">{description}</p>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-1 text-muted-foreground">
                <button
                  className="flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-muted hover:text-foreground"
                  title="Copy"
                  type="button"
                  onClick={handleCopy}
                >
                  <Icon name={copied ? "check" : "copy"} size="sm" />
                </button>
                <button
                  className="flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-muted hover:text-foreground"
                  title="Download"
                  type="button"
                  onClick={handleDownload}
                >
                  <Icon name="download" size="sm" />
                </button>
              </div>
            </div>
          </div>
        )}
        <Streamdown
          remarkPlugins={remarkPlugins || customRemarkPlugins}
          shikiTheme={["vitesse-light", "vitesse-dark"]}
          controls={propsControls ?? {
            code: true,
            mermaid: true,
          }}
          {...props}
        >
          {content}
        </Streamdown>
      </div>
    );
  }
);

StreamingMarkdown.displayName = "StreamingMarkdown";
