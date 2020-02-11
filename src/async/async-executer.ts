
const parallel = (...promises: Promise<any>[]) => {
    return Promise.all(promises)
}

const parallelWithMaxConcurrent = async (maxConcurrent: number, ...promises: Promise<any>[]) => {
    
    let gotPromises: number = 0
    let startPromiseIndex: number = 0
    let endPromiseIndex: number = 0

    let results: any[] = []

    while(promises.length > endPromiseIndex + 1) {

        endPromiseIndex = startPromiseIndex + maxConcurrent - 1
        // console.log(`from ${startPromiseIndex} to ${endPromiseIndex}`)
        results = results.concat(await Promise.all(promises.slice(startPromiseIndex, endPromiseIndex)))
        // console.log(`got ${startPromiseIndex} to ${endPromiseIndex}`)
        startPromiseIndex = startPromiseIndex + maxConcurrent 
    }

    return results
}

const parallelFlux = async function* (...promises: Promise<any>[]) {
    for (const index in promises) {
        if (promises.hasOwnProperty(index)) {
            const promise = await promises[index]
            yield await promise
        }
    }
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

export interface AsyncExecuter {
    parallel: Function
    parallelWithMaxConcurrent (maxConcurrent: number, promises: Promise<any>[]): Promise<any>
    parallelFlux (promises: Promise<any>[]): any
    series: Function
}

export const asyncExecuter = {
    parallel,
    parallelWithMaxConcurrent,
    parallelFlux,
    series, 
}