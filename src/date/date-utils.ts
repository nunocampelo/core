const currentDateTime = () => {
    const now = new Date();
    return now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate() + ' ' + now.getHours() + "-" + now.getMinutes() + "-" + now.getSeconds()
}

export interface DateUtils {
    currentDateTime(): string
}

export const dateUtils = {
    currentDateTime
}