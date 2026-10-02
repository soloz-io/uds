/**
 * Calendar days in a person's time zone.
 *
 * A timestamp is one instant; which DAY it falls on depends on where the reader
 * is. 23:30 UTC on the 20th is already the 21st in Kolkata. Everything here
 * answers "which day, for this person" in one place, so a title, a list grouped
 * by day and a "today" check can never disagree about it.
 *
 * The zone defaults to the reader's own, as their device reports it. Pass
 * `timeZone` (an IANA name, e.g. "Asia/Kolkata") to answer for another one.
 */

export interface DayOptions {
  /** IANA time zone. Defaults to the reader's own. */
  timeZone?: string
}

type DateInput = Date | string | number

/** The reader's time zone as their device reports it, e.g. "Asia/Kolkata". */
export function userTimeZone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone
}

/** Day, short month and year of an instant in a zone; null for an unreadable date. */
function dayParts(value: DateInput, options?: DayOptions): { day: string; month: string; monthNumber: string; year: string } | null {
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return null

  // en-US, deliberately and only for the part names: its short months are the
  // three-letter ones ("Sep", where en-GB gives "Sept"). The order of the parts
  // is decided by the callers below, not by the locale.
  const zone = options?.timeZone ? { timeZone: options.timeZone } : {}
  const named = new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'short', year: 'numeric', ...zone }).formatToParts(date)
  const numeric = new Intl.DateTimeFormat('en-US', { month: '2-digit', ...zone }).formatToParts(date)
  const part = (parts: Intl.DateTimeFormatPart[], type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? ''

  return {
    day: part(named, 'day'),
    month: part(named, 'month'),
    monthNumber: part(numeric, 'month'),
    year: part(named, 'year'),
  }
}

/**
 * A date as a person reads it: "21 Aug 2025". The day is the one the instant
 * falls on in the reader's time zone. Empty for an unreadable date.
 */
export function formatDayLabel(value: DateInput, options?: DayOptions): string {
  const parts = dayParts(value, options)
  return parts ? `${parts.day} ${parts.month} ${parts.year}` : ''
}

/**
 * A date as a sortable key: "2025-08-21", for the day the instant falls on in
 * the reader's time zone. Two instants share a key exactly when they are the
 * same calendar day for that reader. Empty for an unreadable date.
 */
export function dayKey(value: DateInput, options?: DayOptions): string {
  const parts = dayParts(value, options)
  return parts ? `${parts.year}-${parts.monthNumber}-${parts.day.padStart(2, '0')}` : ''
}

/** Whether two instants fall on the same calendar day for the reader. */
export function isSameDay(a: DateInput, b: DateInput, options?: DayOptions): boolean {
  const key = dayKey(a, options)
  return key !== '' && key === dayKey(b, options)
}
