import * as React from "react"
import { mediaTypeFromUrl } from "@/components/composites/MediaPreview"
import { renderMediaOutput } from "@/components/composites/SystemMessage"
import { cn } from "@/lib/utils"

export interface MessageMediaLink {
  url: string
  mediaType: string
}

export interface ExtractedMessageMedia {
  /** The message text with its media links taken out. */
  text: string
  /** The media the text linked to, in order of appearance, each once. */
  media: MessageMediaLink[]
}

// One alternation, tried left to right at each position: an image, a labelled
// link, an angle-bracketed url, a bare url.
const LINK_PATTERN =
  /!\[([^\]]*)\]\((\S+?)(?:\s+"[^"]*")?\)|\[([^\]]+)\]\((\S+?)(?:\s+"[^"]*")?\)|<(https?:\/\/[^>\s]+)>|(https?:\/\/[^\s<>()[\]]+)/g

// Code is shown as written: a url inside a fence or backticks is not a link.
const CODE_PATTERN = /(```[\s\S]*?(?:```|$)|`[^`\n]*`)/g

// A line left with nothing but list markers or punctuation once its media link
// is gone ("- https://…/clip.mp4") is dropped, not shown empty.
const EMPTIED_LINE = /^\s*(?:[-*+]|\d+[.)])?\s*[:.,;—–-]*\s*$/

/**
 * Takes the media links out of a chat message so they can be played after it
 * instead of interrupting it (a url to a video, audio or image file, by its
 * extension). A bare or angle-bracketed media url is removed; a labelled media
 * link keeps its label as plain text; an image's markdown is removed. Every
 * other link is left exactly as it was, and so is anything inside code.
 */
export function extractMessageMedia(content: string): ExtractedMessageMedia {
  const media: MessageMediaLink[] = []
  const seen = new Set<string>()
  const take = (rawUrl: string): boolean => {
    const mediaType = mediaTypeFromUrl(rawUrl)
    if (!mediaType) return false
    if (!seen.has(rawUrl)) {
      seen.add(rawUrl)
      media.push({ url: rawUrl, mediaType })
    }
    return true
  }

  const stripped = content
    .split(CODE_PATTERN)
    .map((part, i) => {
      if (i % 2 === 1) return part
      return part.replace(LINK_PATTERN, (match, _alt, imageUrl, label, linkUrl, angleUrl, bareUrl) => {
        if (imageUrl !== undefined) return take(imageUrl) ? "" : match
        if (linkUrl !== undefined) return take(linkUrl) ? label : match
        if (angleUrl !== undefined) return take(angleUrl) ? "" : match
        // A bare url's trailing punctuation belongs to the sentence.
        const url = (bareUrl as string).replace(/[.,;:!?'"]+$/, "")
        return take(url) ? match.slice(url.length) : match
      })
    })
    .join("")

  if (media.length === 0) return { text: content, media }

  // Only a line that lost a link is tidied; every other line, code included,
  // stays byte for byte. (Links never span lines, so the lines correspond.)
  const originalLines = content.split("\n")
  const text = stripped
    .split("\n")
    .flatMap((line, i) => {
      if (line === originalLines[i]) return [line]
      const tidied = line
        .replace(/(\S)[ \t]{2,}/g, "$1 ")
        // "is ready: <url>." -> "is ready." — the colon introduced what was taken out.
        .replace(/[ \t]*:[ \t]*(?=[.,;!?]|$)/g, "")
        .replace(/[ \t]+([.,;!?])/g, "$1")
        .replace(/[ \t]+$/, "")
      return EMPTIED_LINE.test(tidied) ? [] : [tidied]
    })
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
  return { text, media }
}

export interface MessageMediaProps {
  media: MessageMediaLink[]
  className?: string
}

/** The media a message linked to, played after its text, in order. */
export function MessageMedia({ media, className }: MessageMediaProps) {
  if (media.length === 0) return null
  return (
    <div className={cn("flex flex-col gap-3", className)} data-testid="message-media">
      {media.map((m) => (
        <React.Fragment key={m.url}>{renderMediaOutput(m.url, m.mediaType)}</React.Fragment>
      ))}
    </div>
  )
}
