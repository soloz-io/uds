import { describe, expect, it, vi } from 'vitest';
import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MediaOptionCarousel, type MediaOption } from './MediaOptionCarousel';

const options: MediaOption[] = [
  {
    label: 'Option 1',
    media: { kind: 'image', url: 'https://example.com/1.png', aspect: 'square' },
  },
  {
    label: 'Option 2',
    media: { kind: 'image', url: 'https://example.com/2.png', aspect: 'square' },
  },
];

describe('MediaOptionCarousel selection indicator', () => {
  it('renders selectable check-circle indicator without raw index number', () => {
    const html = renderToStaticMarkup(
      <MediaOptionCarousel
        options={options}
        isSelected={(i) => i === 0}
        onSelect={vi.fn()}
      />,
    );

    // Indicator elements are rendered for each option
    expect(html).toContain('data-testid="media-option-indicator-0"');
    expect(html).toContain('data-testid="media-option-indicator-1"');

    // Selected indicator has primary classes
    expect(html).toContain('bg-primary text-primary-foreground');

    // Unselected indicator does NOT render a plain text digit "2"
    expect(html).not.toMatch(/>\s*2\s*</);
  });
});
