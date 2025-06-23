import dayjs from 'dayjs'

export const formatDate = (date: string | Date, format = 'YYYY-MM-DD'): string => {
    return dayjs(date).format(format)
}

export const formatDateTime = (date: string | Date): string => {
    return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
}

export const formatRelativeTime = (date: string | Date): string => {
    return dayjs(date).fromNow()
}

export const isValidDate = (date: string | Date): boolean => {
    return dayjs(date).isValid()
} 