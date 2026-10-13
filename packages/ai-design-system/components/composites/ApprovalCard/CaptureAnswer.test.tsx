import { describe, expect, it } from 'vitest';
import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ApprovalCard } from './ApprovalCard';

// A capture question (oranger ADR-011): the card records or takes audio itself.

const ask = (capture: Record<string, unknown>) => ({
  name: 'ask_user',
  args: { questions: [{ question: 'Your voice', capture }] },
});
const noop = () => {};

describe('ApprovalCard capture question', () => {
  it('shows the script to read and a record control, and no options', () => {
    const html = renderToStaticMarkup(
      <ApprovalCard
        actionRequest={ask({ kind: 'audio', source: 'record', script: 'OH my gosh… I can HARDLY sit still.' })}
        storeCapture={async () => 'https://x'}
        onApprove={noop}
        onReject={noop}
        onEdit={noop}
      />,
    );
    expect(html).toContain('data-testid="approval-card-capture-script"');
    expect(html).toContain('HARDLY sit still');
    expect(html).toContain('data-testid="approval-card-capture-record"');
    expect(html).not.toContain('Other (write your answer)');
  });

  it('takes a file for an upload, limited to the audio types Waypoint accepts', () => {
    const html = renderToStaticMarkup(
      <ApprovalCard actionRequest={ask({ kind: 'audio', source: 'upload' })} storeCapture={async () => 'https://x'} onApprove={noop} onReject={noop} onEdit={noop} />,
    );
    expect(html).toContain('data-testid="approval-card-capture-pick"');
    expect(html).toContain('accept="audio/webm,audio/wav,audio/mp4,audio/ogg,audio/mpeg"');
    expect(html).not.toContain('approval-card-capture-script');
  });

  it('cannot be submitted before anything is captured', () => {
    const html = renderToStaticMarkup(
      <ApprovalCard actionRequest={ask({ kind: 'audio', source: 'upload' })} storeCapture={async () => 'https://x'} onApprove={noop} onReject={noop} onEdit={noop} />,
    );
    // The submit button is the one carrying the check icon; it is disabled until an address exists.
    expect(html).toMatch(/<button[^>]*disabled=""[^>]*>(?:(?!<\/button>).)*Continue/);
  });
});
