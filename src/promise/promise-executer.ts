
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
    parallelWithMaxConcurrent: Function
    //parallelWithMaxConcurrent (maxConcurrent: number, promises: Promise<any>): Promise<any>
}

export const promiseExecuter = {
    parallel, series, parallelWithMaxConcurrent
}