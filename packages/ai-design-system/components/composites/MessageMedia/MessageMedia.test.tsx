import { describe, expect, it } from 'vitest';
import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MessageMedia, extractMessageMedia } from './MessageMedia';
import { UserMessage } from '../UserMessage';

const VIDEO = 'https://store.example/chat_1/artifacts/01M4/versions/v1/video.mp4';
const VOICE = 'https://store.example/voice/take.wav';

describe('extractMessageMedia', () => {
  it('takes a bare media url out of the sentence, keeping the sentence', () => {
    const { text, media } = extractMessageMedia(`Your video is ready: ${VIDEO}. Have a look.`);
    expect(text).toBe('Your video is ready. Have a look.');
    expect(media).toEqual([{ url: VIDEO, mediaType: 'video/mp4' }]);
  });

  it('keeps a labelled media link as its label, and lists media in order, once each', () => {
    const { text, media } = extractMessageMedia(
      `Draft done — [watch the draft](${VIDEO}) and the voice <${VOICE}>.\n\n- ${VIDEO}`,
    );
    expect(text).toBe('Draft done — watch the draft and the voice.');
    expect(media.map((m) => m.url)).toEqual([VIDEO, VOICE]);
  });

  it('leaves other links and anything inside code untouched', () => {
    const content = 'See https://docs.example.com/guide.\n`curl ' + VIDEO + '`\n```\n    a  ' + VIDEO + '\n```';
    expect(extractMessageMedia(content)).toEqual({ text: content, media: [] });
  });

  it('removes an image written as markdown and plays it after the text', () => {
    const { text, media } = extractMessageMedia('![poster](https://store.example/p.png) Caption.');
    expect(text).toBe('Caption.');
    expect(media).toEqual([{ url: 'https://store.example/p.png', mediaType: 'image/png' }]);
  });
});

describe('MessageMedia', () => {
  it('renders a player for each medium', () => {
    const html = renderToStaticMarkup(
      <MessageMedia media={[{ url: VIDEO, mediaType: 'video/mp4' }, { url: VOICE, mediaType: 'audio/wav' }]} />,
    );
    expect(html).toContain('<video');
    expect(html).toContain('<audio');
  });
});

describe('UserMessage with a media url', () => {
  it('plays the media after the text, not inside it', () => {
    const html = renderToStaticMarkup(
      <UserMessage message={{ id: 'u1', content: `here is my voice ${VOICE} use it` }} />,
    );
    expect(html).toContain('here is my voice use it');
    expect(html.indexOf('<audio')).toBeGreaterThan(html.indexOf('here is my voice use it'));
    expect(html).not.toContain(`>${VOICE}<`);
  });
});
