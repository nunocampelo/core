const path = require('path');

const processExec = require('child_process').exec
const execFile = require('child_process').execFile
const spawn = require('child_process').spawn
import { PromiseResult, exec as promiseProcessExec } from 'child-process-promise'

import { getLogger, Logger } from '../logger'

const logger = getLogger('CoreShell')
const promiseExec: any = (command: string, options: any) => promiseProcessExec(command, options)

const seriePromises: any = async (promises: Promise<any>[]) => {
    for (let index = 0; index < promises.length; index++) {
        await promises
    }
}

const serieAsync: any = async (commands: string[], options: any, silent: boolean = true) => {
    for (let index = 0; index < commands.length; index++) {
        const command = commands[index]
        await async(command, options, silent)
    }
}

const async: any = (command: string, options: any, silent: boolean = true): Promise<void> => {

    const promise: any = promiseProcessExec(command, options)
    let childProcess = promise.childProcess

    childProcess.stdout.on('data', async function (data: any) {
        if (!silent) {
            _logContentData(data)
        }
    })

    childProcess.stderr.on('data', function (data: any) {
        if (!silent) {
            _logContentData(data)
        }
    })

    return promise
}

const asyncIn: any = (command: string, path: string, options: any, silent: boolean = true): Promise<void> => async(`cd ${path} && ${command}`, options, silent)

const exec: any = (command: string, options: any, cb: Function) => {

    let stdoutData: any;
    let stderrData: any;

    const script = processExec(command, options)

    script.stdout.on('data', (data: string) => {
        _logContentData(data)
        stdoutData = data
    })

    script.stderr.on('data', (data: string) => {
        _logContentData(data)
        stderrData = data
    })

    script.on('close', (code: Number) => {
        if (code != 0) {
            logger.error(`child process exited with error code ${code}`)
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

const toCmdPath = (bashPath: string) => path.resolve(bashPath.replace('/d', ''))

const _logContentData = (content: any) => content.toString().split('\n').forEach((line: string) => logger.info(line.replace(/\r/g,'')))

export interface Shell {
    exec: Function
    silentExec: Function
    toCmdPath: Function
    promiseExec: Function
    serieAsync: Function
    async: Function
    asyncIn: Function
    seriePromises: Function
}

export const shell: Shell = {
    exec,
    silentExec,
    toCmdPath,
    promiseExec,
    serieAsync,
    async,
    asyncIn,
    seriePromises
}


