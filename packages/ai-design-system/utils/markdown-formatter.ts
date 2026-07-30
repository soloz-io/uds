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

export interface ExportableMessage {
  type?: string;
  role?: string;
  content?: string;
  toolCalls?: ToolCallData[];
  subAgents?: SubAgentData[];
}

export function formatMessagesToMarkdown(messages: ExportableMessage[]): string {
  if (!messages || messages.length === 0) return '';

  return messages
    .map((msg) => {
      const roleName = msg.type === 'human' ? 'User' : `AI (${msg.role || 'assistant'})`;
      let text = `**${roleName}:**\n`;

      if (msg.content) {
        text += `${msg.content}\n`;
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
