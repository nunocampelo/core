
const parallel = (...promises: Promise<any>[]) => {
    return Promise.all(promises)
}

const series = (...promises: Promise<any>[]) => {
    return promises.reduce((promiseChain, currentPromise) => {
        return promiseChain.then(chainResults =>
            currentPromise.then(currentResult =>
                [...chainResults, currentResult]
            )
        )
    }, Promise.resolve([]));
}

export interface PromiseExecuter {
    parallel: Function
    series: Function
}

export const promiseExecuter = {
    parallel, series
}