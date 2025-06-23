import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

// Extend dayjs with the relativeTime plugin
dayjs.extend(relativeTime)

export function formatDate(date: string | Date, format = 'YYYY-MM-DD'): string {
  return dayjs(date).format(format)
}

export function formatDateTime(date: string | Date): string {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
}

export function formatRelativeTime(date: string | Date): string {
  return dayjs(date).fromNow()
}

export function isValidDate(date: string | Date): boolean {
  return dayjs(date).isValid()
}
