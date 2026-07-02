import { type ComponentProps, memo } from "react";
import { Streamdown, defaultRemarkPlugins } from "streamdown";
import remarkFrontmatter from "remark-frontmatter";

const customRemarkPlugins = [
  ...Object.values(defaultRemarkPlugins),
  remarkFrontmatter,
];

export type StreamingMarkdownProps = ComponentProps<typeof Streamdown>;

/**
 * A composite component that wraps Streamdown with all configured plugins.
 * Features should import this component instead of importing Streamdown directly.
 */
export const StreamingMarkdown = memo(
  ({ remarkPlugins, ...props }: StreamingMarkdownProps) => (
    <Streamdown
      remarkPlugins={remarkPlugins || customRemarkPlugins}
      {...props}
    />
  )
);

StreamingMarkdown.displayName = "StreamingMarkdown";
