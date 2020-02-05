const range = (end: number, start: number = 1) => {

    if (end < 1) {
        throw new Error(`Invalid end for range ${end}`)
    }

    if (start > end) {
        throw new Error(`Start must be bigger that end`)
    }

    const x = []
    var i = start
    while (x.push(i++) < end - start + 1) {
    }

    return x
}

const reverseRange = (end: number, start: number = 1) => {

    if (end < 1) {
        throw new Error(`Invalid end for range ${end}`)
    }

    if (start > end) {
        throw new Error(`Start must be bigger that end`)
    }

    const x = []
    var i = end
    while (x.push(i--) < end - start + 1) {
    }

    return x
}

export interface ArrayUtils {
    range(): number[]
    reverseRange(): number[]
}

export const arrayUtils = {
    range,
    reverseRange
}