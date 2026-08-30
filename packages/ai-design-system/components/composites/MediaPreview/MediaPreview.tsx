/**
 * MediaPreview Composite Component
 * 
 * Renders native preview players and viewers for binary media files
 * (video, audio, images, documents) within the TextEditor pane.
 */

import React from 'react'
import type { DocumentFile } from '@/types/ai-editor/editor'
import { cn } from '@/lib/utils'
import { Icon } from '@/components/primitives/Icon'

export interface MediaFileLike {
  id?: string
  name?: string
  format?: 'json' | 'markdown' | string
  url?: string
  mediaType?: string
  isDirty?: boolean
  lastModified?: number
}

export interface MediaPreviewProps {
  file: MediaFileLike
  className?: string
}

export function isVideoFile(file: MediaFileLike): boolean {
  const format = file.format?.toLowerCase() || ''
  const ext = file.name?.split('.').pop()?.toLowerCase() || ''
  if (['mp4', 'webm', 'mov', 'mkv', 'avi'].includes(format) || ['mp4', 'webm', 'mov', 'mkv', 'avi'].includes(ext)) return true
  if (file.mediaType?.startsWith('video/')) return true
  if (file.url && /\.(mp4|webm|mov|mkv)(\?.*)?$/i.test(file.url)) return true
  return false
}

export function isAudioFile(file: MediaFileLike): boolean {
  const format = file.format?.toLowerCase() || ''
  const ext = file.name?.split('.').pop()?.toLowerCase() || ''
  if (['wav', 'mp3', 'ogg', 'm4a', 'flac', 'aac', 'wma'].includes(format) || ['wav', 'mp3', 'ogg', 'm4a', 'flac', 'aac', 'wma'].includes(ext)) return true
  if (file.mediaType?.startsWith('audio/')) return true
  if (file.url && /\.(wav|mp3|ogg|m4a|flac|aac)(\?.*)?$/i.test(file.url)) return true
  return false
}

export function isImageFile(file: MediaFileLike): boolean {
  const format = file.format?.toLowerCase() || ''
  const ext = file.name?.split('.').pop()?.toLowerCase() || ''
  if (['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg', 'ico', 'bmp'].includes(format) || ['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg', 'ico', 'bmp'].includes(ext)) return true
  if (file.mediaType?.startsWith('image/')) return true
  if (file.url && /\.(png|jpg|jpeg|webp|gif|svg)(\?.*)?$/i.test(file.url)) return true
  return false
}

export function isPdfFile(file: MediaFileLike): boolean {
  const format = file.format?.toLowerCase() || ''
  const ext = file.name?.split('.').pop()?.toLowerCase() || ''
  return format === 'pdf' || ext === 'pdf' || file.mediaType === 'application/pdf'
}

export function isMediaFile(file: MediaFileLike): boolean {
  return isVideoFile(file) || isAudioFile(file) || isImageFile(file) || isPdfFile(file)
}

export const MediaPreview: React.FC<MediaPreviewProps> = ({ file, className }) => {
  const isVideo = isVideoFile(file)
  const isAudio = isAudioFile(file)
  const isImage = isImageFile(file)
  const isPdf = isPdfFile(file)

  const mediaUrl = file.url

  if (!mediaUrl) {
    return (
      <div className={cn('flex flex-col items-center justify-center h-full p-8 text-center', className)}>
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/60 mb-4 text-muted-foreground">
          {isVideo && <Icon name="film" className="h-8 w-8" />}
          {isAudio && <Icon name="music" className="h-8 w-8" />}
          {isImage && <Icon name="image" className="h-8 w-8" />}
          {isPdf && <Icon name="file-text" className="h-8 w-8" />}
          {!isVideo && !isAudio && !isImage && !isPdf && <Icon name="alert-circle" className="h-8 w-8" />}
        </div>
        <h3 className="text-base font-medium text-foreground mb-1">{file.name || 'Media File'}</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          No direct stream URL is available for this file yet.
        </p>
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col h-full w-full overflow-y-auto p-6 bg-background/50', className)}>
      {/* Header Info */}
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            {isVideo && <Icon name="film" className="h-5 w-5" />}
            {isAudio && <Icon name="music" className="h-5 w-5" />}
            {isImage && <Icon name="image" className="h-5 w-5" />}
            {isPdf && <Icon name="file-text" className="h-5 w-5" />}
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground tracking-tight">{file.name}</h2>
            <p className="text-xs text-muted-foreground">
              {file.mediaType || file.format?.toUpperCase() || 'Binary Media'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={mediaUrl}
            target="_blank"
            rel="noopener noreferrer"
            download={file.name}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-border bg-background hover:bg-muted text-foreground transition-colors shadow-sm"
          >
            <Icon name="download" className="h-3.5 w-3.5" />
            Download
          </a>
          <a
            href={mediaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-border bg-background hover:bg-muted text-foreground transition-colors shadow-sm"
          >
            <Icon name="external-link" className="h-3.5 w-3.5" />
            Open
          </a>
        </div>
      </div>

      {/* Main Media Player / Viewer */}
      <div className="flex-1 flex flex-col items-center justify-center min-h-[300px]">
        {isVideo && (
          <div className="w-full max-w-4xl flex flex-col items-center justify-center bg-black/95 rounded-2xl overflow-hidden shadow-lg border border-border/40">
            <video
              controls
              playsInline
              preload="metadata"
              src={mediaUrl}
              className="max-h-[65vh] w-auto max-w-full rounded-2xl"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        )}

        {isAudio && (
          <div className="w-full max-w-xl p-8 rounded-2xl border border-border bg-card shadow-sm flex flex-col items-center gap-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icon name="music" className="h-10 w-10 animate-pulse" />
            </div>
            <div className="text-center">
              <h3 className="text-base font-semibold text-foreground mb-1">{file.name}</h3>
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Audio Playback</span>
            </div>
            <audio controls preload="metadata" src={mediaUrl} className="w-full h-12">
              Your browser does not support the audio element.
            </audio>
          </div>
        )}

        {isImage && (
          <div className="flex items-center justify-center w-full max-w-4xl rounded-2xl border border-border bg-muted/20 p-4 shadow-sm">
            <img
              src={mediaUrl}
              alt={file.name}
              className="max-h-[68vh] w-auto max-w-full rounded-xl object-contain shadow-md"
            />
          </div>
        )}

        {isPdf && (
          <div className="w-full h-full min-h-[500px] rounded-2xl overflow-hidden border border-border shadow-sm">
            <iframe
              src={mediaUrl}
              title={file.name}
              className="w-full h-full min-h-[500px]"
            />
          </div>
        )}
      </div>
    </div>
  )
}
