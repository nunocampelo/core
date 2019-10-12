const path = require('path');

const processExec = require('child_process').exec
const execFile = require('child_process').execFile
const spawn = require('child_process').spawn

import { PromiseResult, exec as promiseProcessExec } from 'child-process-promise'

const promiseExec: any = (command: string, options: any) => {
    return promiseProcessExec(command, options)
}

const serieAsync: any = async (commands: string[], options: any) => {
    for (let index = 0; index < commands.length; index++) {
        const command = commands[index]
        await async(command, options)
    }
}

const async: any = (command: string, options: any): Promise<void> => {

    const promise: any = promiseProcessExec(command, options).then().catch()

    let childProcess = promise.childProcess

    childProcess.stdout.on('data', function (data: any) {
        console.log(data.toString().replace('\n', ''))
    })

    childProcess.stderr.on('data', function (data: any) {
        console.log(data.toString().replace('\n', ''))
    })

    return promise
}

const asyncIn: any = (command: string, path: string,  options: any): Promise<void> => {
    return async(`cd ${path} ${command}`, options)
}

const exec: any = (command: string, options: any, cb: Function) => {

    let stdoutData: any;
    let stderrData: any;

    const script = processExec(command, options)

    script.stdout.on('data', (data: string) => {
        console.log(data)
        stdoutData = data
    })

    script.stderr.on('data', (data: string) => {
        console.log(data)
        stderrData = data
    })

    script.on('close', (code: Number) => {
        if (code != 0) {
            console.log(`child process exited with error code ${code}`)
        }

        if (cb) {
            cb(script, stdoutData, stderrData)
        }
    })

    return script
}

const silentExec: any = (command: string, cb: Function) => {

    const script = processExec(command)

    script.on('close', (code: Number) => {
        if (cb) {
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
    promiseExec: Function,
    serieAsync: Function,
    async: Function,
    asyncIn: Function
    // execInCore: Function,
    // silentExecInCore: Function
}

export const shell: Shell = {
    exec,
    silentExec,
    toCmdPath,
    promiseExec,
    serieAsync,
    async,
    asyncIn
    // execInCore,
    // silentExecInCore
}


