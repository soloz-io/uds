export interface ToolCallData {
  id?: string;
  name: string;
  status: string;
  args?: Record<string, unknown>;
  result?: unknown;
  output?: unknown;
}

export interface SubAgentData {
  id?: string;
  subAgentName: string;
  status: string;
  input?: unknown;
  output?: unknown;
}

export interface ExportableAttachment {
  id?: string;
  kind?: string;
  mime?: string;
  mimeType?: string;
  type?: string;
  filename?: string;
  source?: { type: string; value: string };
  url?: string;
  src?: string;
}

interface ContentBlock {
  type?: string;
  text?: string;
  source_type?: string;
  url?: string;
  source?: { type?: string; value?: string };
}

export interface ExportableMessage {
  type?: string;
  role?: string;
  content?: string | unknown;
  attachments?: ExportableAttachment[];
  toolCalls?: ToolCallData[];
  subAgents?: SubAgentData[];
}

function getAttachmentUrl(att: unknown): string | undefined {
  if (typeof att === 'string') return att;
  if (!att || typeof att !== 'object') return undefined;
  const a = att as ExportableAttachment;
  if (a.source && typeof a.source.value === 'string') {
    return a.source.value;
  }
  if (typeof a.url === 'string') return a.url;
  if (typeof a.src === 'string') return a.src;
  return undefined;
}

function getAttachmentKind(att: unknown, url: string): 'image' | 'audio' | 'video' | 'file' {
  if (att && typeof att === 'object') {
    const a = att as ExportableAttachment;
    const mime = typeof a.mime === 'string' ? a.mime : typeof a.mimeType === 'string' ? a.mimeType : '';
    if (mime.startsWith('image/')) return 'image';
    if (mime.startsWith('audio/')) return 'audio';
    if (mime.startsWith('video/')) return 'video';
    const kind = typeof a.kind === 'string' ? a.kind : typeof a.type === 'string' ? a.type : '';
    if (kind === 'image') return 'image';
    if (kind === 'audio') return 'audio';
    if (kind === 'video') return 'video';
  }
  const ext = (url.split(/[?#]/)[0].split('.').pop() || '').toLowerCase();
  if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(ext)) return 'image';
  if (['wav', 'mp3', 'ogg', 'm4a', 'flac', 'aac', 'webm'].includes(ext)) return 'audio';
  if (['mp4', 'mov'].includes(ext)) return 'video';
  return 'file';
}

function formatAttachmentMarkdown(att: unknown, url: string): string {
  const kind = getAttachmentKind(att, url);
  const a = att && typeof att === 'object' ? (att as ExportableAttachment) : undefined;
  let filename = typeof a?.filename === 'string' ? a.filename : undefined;

  if (!filename) {
    try {
      const pathname = new URL(url).pathname;
      const base = pathname.split('/').pop() || '';
      filename = decodeURIComponent(base).replace(/^[0-9a-fA-F]{8}-/, '');
    } catch {
      const base = url.split(/[?#]/)[0].split('/').pop() || '';
      filename = decodeURIComponent(base).replace(/^[0-9a-fA-F]{8}-/, '');
    }
  }

  if (kind === 'image') {
    return `![${filename || 'Attached image'}](${url})`;
  }
  if (kind === 'audio') {
    return `<audio controls src="${url}"></audio>`;
  }
  if (kind === 'video') {
    return `<video controls src="${url}"></video>`;
  }
  return `[${filename || 'Attached file'}](${url})`;
}

export function formatMessagesToMarkdown(messages: ExportableMessage[]): string {
  if (!messages || messages.length === 0) return '';

  return messages
    .map((msg) => {
      const roleName = msg.type === 'human' ? 'User' : `AI (${msg.role || 'assistant'})`;
      let text = `**${roleName}:**\n`;

      let content = '';
      const attachments: ExportableAttachment[] = [...(msg.attachments || [])];
      const rawContent: unknown = msg.content;

      if (typeof rawContent === 'string') {
        content = rawContent;
      } else if (Array.isArray(rawContent)) {
        for (const item of rawContent) {
          if (typeof item === 'string') {
            content += (content ? '\n' : '') + item;
          } else if (item && typeof item === 'object') {
            const block = item as ContentBlock;
            if (block.type === 'text' && typeof block.text === 'string') {
              content += (content ? '\n' : '') + block.text;
            } else if (block.type === 'image') {
              const url =
                block.source_type === 'url' && typeof block.url === 'string'
                  ? block.url
                  : typeof block.url === 'string'
                    ? block.url
                    : block.source?.value;
              if (typeof url === 'string') {
                attachments.push({ kind: 'image', source: { type: 'object', value: url } });
              }
            }
          }
        }
      } else if (rawContent !== undefined && rawContent !== null) {
        content = String(rawContent);
      }

      if (content) {
        for (const match of content.matchAll(/\[Attached (image|audio|file|video): ([^\]\n]+)\]/gi)) {
          const kind = match[1].toLowerCase();
          const url = match[2].trim();
          if (/^https?:\/\//i.test(url) && !attachments.some((a) => getAttachmentUrl(a) === url)) {
            attachments.push({ kind, source: { type: 'object', value: url } });
          }
        }
        for (const match of content.matchAll(/(?:^|\r?\n)ATTACHMENT:\s*([^\s\n\r]+)/gi)) {
          const url = match[1].replace(/^<|>$/g, '').trim();
          if (/^https?:\/\//i.test(url) && !attachments.some((a) => getAttachmentUrl(a) === url)) {
            attachments.push({ source: { type: 'object', value: url } });
          }
        }

        content = content
          .replace(/\[Attached (image|audio|file|video): ([^\]\n]+)\]/gi, '')
          .replace(/(?:^|\r?\n)ATTACHMENT:\s*([^\s\n\r]+)/gi, '')
          .trim();
      }

      if (content) {
        text += `${content}\n`;
      }

      if (attachments.length > 0) {
        for (const att of attachments) {
          const url = getAttachmentUrl(att);
          if (!url) continue;
          text += `${formatAttachmentMarkdown(att, url)}\n`;
        }
      }

      if (msg.toolCalls && msg.toolCalls.length > 0) {
        text += `\n*Tool Calls:*\n`;
        msg.toolCalls.forEach((tc) => {
          text += `- \`${tc.name}\` (${tc.status})\n`;
          if (tc.args && Object.keys(tc.args).length > 0) {
            text += `  - Args: \`${JSON.stringify(tc.args)}\`\n`;
          }
          const res = tc.result ?? tc.output;
          if (res !== undefined && res !== null) {
            text += `  - Result: \`${typeof res === 'string' ? res : JSON.stringify(res)}\`\n`;
          }
        });
      }

      if (msg.subAgents && msg.subAgents.length > 0) {
        text += `\n*Sub-Agents:*\n`;
        msg.subAgents.forEach((sa) => {
          text += `- \`${sa.subAgentName}\` (${sa.status})\n`;
          if (sa.input !== undefined && sa.input !== null) {
            text += `  - Input: \`${typeof sa.input === 'string' ? sa.input : JSON.stringify(sa.input)}\`\n`;
          }
          if (sa.output !== undefined && sa.output !== null) {
            text += `  - Output: \`${typeof sa.output === 'string' ? sa.output : JSON.stringify(sa.output)}\`\n`;
          }
        });
      }

      return text;
    })
    .join('\n');
}

export function exportMessagesToMarkdownFile(
  messages: ExportableMessage[],
  filename = 'chat-history.md'
): { content: string; blob: Blob; filename: string } | undefined {
  if (!messages || messages.length === 0) return undefined;
  const content = formatMessagesToMarkdown(messages);
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  return { content, blob, filename };
}
