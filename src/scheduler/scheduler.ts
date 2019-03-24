const forever = (cb: Function, delay: number, initial?: number, args?: any[]) => {

    initial = initial || 0

    const cycle = () => {
        cb(args)
        setTimeout(cycle, delay)
    }

    setTimeout(cycle, initial)
}

export interface Scheduler {
    forever: Function
}

export const scheduler: Scheduler = {
    forever
}