const currentDateTime = () => {
    return (new Date()).toISOString().replace(/[^a-z0-9]/gi, '-')
}

export interface DateUtils {
    currentDateTime(): string
}

export const dateUtils = {
    currentDateTime
}