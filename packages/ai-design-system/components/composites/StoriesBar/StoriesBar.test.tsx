import { describe, expect, it } from 'vitest';
import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { StoriesBar, type StoryItem } from './StoriesBar';

describe('StoriesBar', () => {
  const stories: StoryItem[] = [
    { id: 'channel', title: 'Channel', icon: 'sparkles', status: 'working' },
    { id: 'video-ready', title: 'Ready Video', status: 'ready', unread: true },
    { id: 'video-failed', title: 'Failed Video', status: 'failed' },
    { id: 'video-stopped', title: 'Stopped Video', status: 'stopped', unread: false },
  ];

  it('renders status on icon colour: working=amber, ready=emerald, failed=red, stopped=muted', () => {
    const html = renderToStaticMarkup(
      <StoriesBar stories={stories} onStoryClick={() => {}} />
    );

    // Channel (working) has text-amber-500
    expect(html).toContain('btn-story-channel');
    expect(html).toContain('text-amber-500');

    // Ready video has text-emerald-500
    expect(html).toContain('btn-story-video-ready');
    expect(html).toContain('text-emerald-500');

    // Failed video has text-red-500
    expect(html).toContain('btn-story-video-failed');
    expect(html).toContain('text-red-500');

    // Stopped video has text-muted-foreground
    expect(html).toContain('btn-story-video-stopped');
    expect(html).toContain('text-muted-foreground');
  });

  it('shows badge dot ONLY when unread is true', () => {
    const html = renderToStaticMarkup(
      <StoriesBar stories={stories} onStoryClick={() => {}} />
    );

    // unread: true -> badge rendered
    expect(html).toContain('data-testid="story-badge-video-ready"');

    // unread: false or undefined -> NO badge rendered
    expect(html).not.toContain('data-testid="story-badge-channel"');
    expect(html).not.toContain('data-testid="story-badge-video-failed"');
    expect(html).not.toContain('data-testid="story-badge-video-stopped"');

    // When video-ready is active and unread, badge is still rendered (e.g. pending approval card)
    const activeHtml = renderToStaticMarkup(
      <StoriesBar stories={stories} activeStoryId="video-ready" onStoryClick={() => {}} />
    );
    expect(activeHtml).toContain('data-testid="story-badge-video-ready"');
  });

  it('renders every bubble as a story without separate homeItem', () => {
    const html = renderToStaticMarkup(
      <StoriesBar stories={stories} onStoryClick={() => {}} />
    );

    // Every item in stories is rendered as a button
    expect(html).toContain('data-testid="btn-story-channel"');
    expect(html).toContain('data-testid="btn-story-video-ready"');
    expect(html).toContain('data-testid="btn-story-video-failed"');
    expect(html).toContain('data-testid="btn-story-video-stopped"');

    // No legacy separate channel-badge
    expect(html).not.toContain('data-testid="channel-badge"');
  });

  it('renders collapsible toggle button with chevron by default', () => {
    const html = renderToStaticMarkup(
      <StoriesBar stories={stories} onStoryClick={() => {}} />
    );

    expect(html).toContain('data-testid="btn-toggle-stories-collapse"');
    expect(html).toContain('aria-expanded="true"');
    expect(html).toContain('id="stories-bubbles-list"');
  });

  it('hides scroll buttons and bubbles list when collapsed', () => {
    const html = renderToStaticMarkup(
      <StoriesBar stories={stories} collapsed={true} onStoryClick={() => {}} />
    );

    expect(html).toContain('data-testid="btn-toggle-stories-collapse"');
    expect(html).toContain('aria-expanded="false"');
    expect(html).not.toContain('id="stories-bubbles-list"');
    expect(html).not.toContain('aria-label="Scroll left"');
    expect(html).not.toContain('aria-label="Scroll right"');
  });

  it('renders plain title without collapse button when collapsible=false', () => {
    const html = renderToStaticMarkup(
      <StoriesBar stories={stories} collapsible={false} onStoryClick={() => {}} />
    );

    expect(html).not.toContain('data-testid="btn-toggle-stories-collapse"');
    expect(html).toContain('Conversations');
    expect(html).toContain('id="stories-bubbles-list"');
  });
});
