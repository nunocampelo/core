// import { Logger, getLogger } from '../logger/logger'

// const execute = require('child_process').exec

// const logger: Logger = getLogger('shell')

// const exec = (command: string, options: any, callback: any) => {

//     const process = execute(command, options, callback)

//     process.stdout.on('data', (data: any) =>
//         logger.info(`[.] ${data.toString()}`)
//     )

//     process.stderr.on('data', (data: any) => {
//         logger.error(`[x] ${data}`)
//     })

//     process.on('SIGINT', function (code: number) {
//         console.log('child process exited with code ' + code.toString());
//     })

//     return process
// }

// export const shell: any = {
//     exec
// }

const path = require('path');

const processExec = require('child_process').exec
const execFile = require('child_process').execFile
const spawn = require('child_process').spawn
// const DEV_PATH = 'D:\\Users\\T0206442\\dev\\core'


const exec: any = (command: string, options: any, cb: Function) => {

    const script = processExec(command, options)

    script.stdout.on('data', (data: string) => {
        console.log(data)
    })

    script.stderr.on('data', (data: string) => {
        console.log(data)
    })

    script.on('close', (code: Number) => {
        if (code != 0) {
            console.log(`child process exited with error code ${code}`)
        }

        if(cb) {
            cb(script)
        }
    })

    return script
}

const silentExec: any = (command: string, cb: Function) => {

    const script = processExec(command)

    script.on('close', (code: Number) => {
        if(cb) {
            cb(script)
        }
    })

    return script
}

const toCmdPath = (bashPath: string) => {
    return path.resolve(bashPath.replace('/d', ''))
}

// const silentExecInCore = (command: string, cb: Function = () => {}, folder: string = '') => {
//     return shellUtils.exec(`cd ${DEV_PATH}\\${folder} && ${command}`, cb)
// }

// const execInCore = (command: string, cb: Function = () => {}, folder: string = '') => {
//     return shellUtils.exec(`cd ${DEV_PATH}\\${folder} && ${command}`, cb)
// }

export interface Shell {
    exec: Function,
    silentExec: Function,
    toCmdPath: Function,
    // execInCore: Function,
    // silentExecInCore: Function
}

export const shell: Shell = {
    exec,
    silentExec,
    toCmdPath,
    // execInCore,
    // silentExecInCore
}


