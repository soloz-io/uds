import { describe, expect, it } from 'vitest';
import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ApprovalCard } from './ApprovalCard';

// A carousel question with an upload tile: the user uploads their own image
// (the first tile) or picks one of the options.

const STYLES = [
  { label: 'Style 1', media: { kind: 'image', url: 'https://s/1.jpeg', aspect: 'portrait' } },
  { label: 'Style 2', media: { kind: 'image', url: 'https://s/2.jpeg', aspect: 'portrait' } },
];
const ask = (capture: Record<string, unknown> | undefined) => ({
  name: 'ask_user',
  args: { questions: [{ question: 'Pick a style', layout: 'carousel', options: STYLES, capture }] },
});
const noop = () => {};
const render = (capture: Record<string, unknown> | undefined) =>
  renderToStaticMarkup(
    <ApprovalCard actionRequest={ask(capture)} storeCapture={async () => 'https://x'} onApprove={noop} onReject={noop} onEdit={noop} />,
  );

describe('ApprovalCard upload tile', () => {
  it('shows the upload tile first, captioned, before the options', () => {
    const html = render({ kind: 'image', source: 'upload', label: 'Your reference' });
    const tile = html.indexOf('data-testid="approval-card-upload-tile"');
    expect(tile).toBeGreaterThan(-1);
    expect(tile).toBeLessThan(html.indexOf('data-testid="media-option-0"'));
    expect(html).toContain('Your reference');
    expect(html).toContain('accept="image/png,image/jpeg,image/webp,image/gif"');
    // It is not a capture answer of its own.
    expect(html).not.toContain('data-testid="approval-card-capture"');
  });

  it('is not chosen, so the question cannot be submitted, before anything is uploaded or picked', () => {
    const html = render({ kind: 'image', source: 'upload', label: 'Your reference' });
    expect(html).toContain('aria-pressed="false"');
    expect(html).toMatch(/<button[^>]*disabled=""[^>]*>(?:(?!<\/button>).)*Continue/);
  });

  it('is absent from a carousel without a capture', () => {
    expect(render(undefined)).not.toContain('approval-card-upload-tile');
  });

  it('takes an image alone as a capture answer with an image picker', () => {
    const html = renderToStaticMarkup(
      <ApprovalCard
        actionRequest={{ name: 'ask_user', args: { questions: [{ question: 'Upload a reference', capture: { kind: 'image', source: 'upload' } }] } }}
        storeCapture={async () => 'https://x'}
        onApprove={noop}
        onReject={noop}
        onEdit={noop}
      />,
    );
    expect(html).toContain('Choose an image');
    expect(html).toContain('accept="image/png,image/jpeg,image/webp,image/gif"');
  });
});
