import { describe, expect, it } from 'vitest';
import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { UserMessage } from './UserMessage';

const VOICE_URL = 'https://store.example/voice/take.wav';
const OBJECT_STORE_AUDIO = 'https://hel1.your-objectstorage.com/bucket/voice.webm';

describe('UserMessage selection card', () => {
  it('renders audio player instead of raw text when selection answer contains attached audio', () => {
    const html = renderToStaticMarkup(
      <UserMessage
        message={{
          id: 'u-sel-1',
          content: `[Attached audio: ${OBJECT_STORE_AUDIO}]`,
          selection: {
            question: 'Re-record your narration voice — read the script below.',
            answer: `[Attached audio: ${OBJECT_STORE_AUDIO}]`,
            count: 1,
          },
        }}
      />,
    );

    // Question should be rendered
    expect(html).toContain('Re-record your narration voice — read the script below.');
    // Audio controls should be rendered with the object storage URL
    expect(html).toContain('<audio');
    expect(html).toContain(`src="${OBJECT_STORE_AUDIO}"`);
    expect(html).toContain('data-testid="user-selection-audio"');
    // Raw [Attached audio: ...] should NOT be rendered in the output
    expect(html).not.toContain('[Attached audio:');
  });

  it('renders accompanying text alongside audio player when selection has both', () => {
    const html = renderToStaticMarkup(
      <UserMessage
        message={{
          id: 'u-sel-2',
          content: `Take 2, [Attached audio: ${VOICE_URL}]`,
          selection: {
            question: 'Select preferred take',
            answer: `Take 2, [Attached audio: ${VOICE_URL}]`,
            count: 1,
          },
        }}
      />,
    );

    expect(html).toContain('Select preferred take');
    expect(html).toContain('Take 2');
    expect(html).toContain('<audio');
    expect(html).toContain(`src="${VOICE_URL}"`);
    expect(html).not.toContain('[Attached audio:');
  });

  it('renders standard text selection answer without audio player', () => {
    const html = renderToStaticMarkup(
      <UserMessage
        message={{
          id: 'u-sel-3',
          content: 'Option 1',
          selection: {
            question: 'Pick an option',
            answer: 'Option 1',
            count: 1,
          },
        }}
      />,
    );

    expect(html).toContain('Pick an option');
    expect(html).toContain('Option 1');
    expect(html).not.toContain('<audio');
  });

  it('shows an uploaded image answer as the image, not as raw text', () => {
    const IMAGE = 'https://store.example/app/app/chat-attachments/ref.jpeg';
    const html = renderToStaticMarkup(
      <UserMessage
        message={{
          id: 'u-sel-img',
          content: `[Attached image: ${IMAGE}]`,
          selection: { question: 'Pick a style for your character', answer: `[Attached image: ${IMAGE}]`, count: 1 },
        }}
      />,
    );
    expect(html).toContain(IMAGE);
    expect(html).not.toContain('[Attached image:');
  });
});
