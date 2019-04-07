import { Transporter, SendMailOptions, SentMessageInfo } from 'nodemailer'

import { getLogger, Logger } from '../logger/logger'

const nodemailer = require("nodemailer")
const logger: Logger = getLogger('Mailer')

let transporter: Transporter;

const start = async (options: object) => {
    transporter = await nodemailer.createTransport(options)
}

const send = (email: SendMailOptions): Promise<SentMessageInfo> => {

    logger.info(`[$] Outgoing email to ${email.to}`)

    return transporter.sendMail(email).then((mailInfo: SentMessageInfo) => {
        logger.info(`[>] Email sent with id ${mailInfo.messageId}`)
        return mailInfo
    })
}

const close = () => transporter.close()

export { SendMailOptions } from 'nodemailer'

export interface Mailer {
    start(options: object): void
    send(email: SendMailOptions): Promise<SentMessageInfo>
    close(): void
}

export const mailer: Mailer = { start, send, close }