import { describe, expect, it } from 'vitest';
import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ToolCallDisplay } from './ToolCallDisplay';
import { SpecialistMessage } from '../SpecialistMessage/SpecialistMessage';

const STATUS_WORDS = /Running|Completed|Error|Pending|Awaiting|Denied|Responded/;

describe('a step the user stopped shows no status', () => {
  it('a stopped tool call shows its name and no status badge', () => {
    const html = renderToStaticMarkup(
      <ToolCallDisplay toolCall={{ id: 't1', name: 'read_file', args: { path: 'a.md' }, status: 'stopped' }} />,
    );
    expect(html).toContain('read_file');
    expect(html).not.toMatch(STATUS_WORDS);
  });

  it('a running tool call still shows that it runs', () => {
    const html = renderToStaticMarkup(
      <ToolCallDisplay toolCall={{ id: 't1', name: 'read_file', args: {}, status: 'pending' }} />,
    );
    expect(html).toMatch(/Running/);
  });

  it('a stopped specialist shows no status', () => {
    const html = renderToStaticMarkup(
      <SpecialistMessage message={{ id: 's1', name: 'media-generator', content: 'half way', status: 'stopped' }} />,
    );
    expect(html).toContain('media-generator');
    expect(html).not.toMatch(STATUS_WORDS);
  });
});
