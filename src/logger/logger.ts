import { getLogger as getLog4jsLogger, Logger, levels } from 'log4js'

export const getLogger = (target: string, level?: string) => {
    const logger: Logger = getLog4jsLogger(target)
    logger.level = level || levels.INFO.toString()
    return logger
}

export { Logger } from 'log4js'