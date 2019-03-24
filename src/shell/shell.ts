import { Logger, getLogger } from '../logger/logger'

const execute = require('child_process').exec

const logger: Logger = getLogger('shell')

const exec = async (command: string) => {

    const process = await execute(command)

    process.stdout.on('data', (data: any) =>
        logger.info(`[.] ${data.toString()}`)
    )

    process.stderr.on('data', (data: any) => {
        logger.error(`[x] ${data}`)
    })

    //   process.on('exit', function (code) {
    //     console.log('child process exited with code ' + code.toString());
    //   })
}

export const shell: any = {
    exec
}
