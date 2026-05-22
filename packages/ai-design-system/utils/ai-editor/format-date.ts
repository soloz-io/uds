/**
 * Format Comment Date Utility
 * 
 * Formats timestamps as relative time for comment display
 */

import { formatDistanceToNow } from 'date-fns'

/**
 * Formats a timestamp as relative time
 * 
 * @param date - Date object or Unix timestamp (number) to format
 * @returns Formatted string like "5m", "2h", "3d", "2w", "3mo", "1y"
 * 
 * @example
 * ```ts
 * formatCommentDate(new Date(Date.now() - 5 * 60 * 1000)) // "5m"
 * formatCommentDate(Date.now() - 2 * 60 * 60 * 1000) // "2h"
 * ```
 */
export function formatCommentDate(date: Date | number): string {
  const now = Date.now()
  const timestamp = typeof date === 'number' ? date : date.getTime()
  const diffMs = now - timestamp

  const seconds = Math.floor(diffMs / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const weeks = Math.floor(days / 7)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)

  if (seconds < 60) return 'just now'
  if (minutes < 60) return `${minutes}m`
  if (hours < 24) return `${hours}h`
  if (days < 7) return `${days}d`
  if (weeks < 4) return `${weeks}w`
  if (months < 12) return `${months}mo`
  return `${years}y`
}
