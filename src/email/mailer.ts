import { Transporter, SendMailOptions } from 'nodemailer'

import { getLogger, Logger } from '../logger/logger'

const nodemailer = require("nodemailer")
const logger: Logger = getLogger('Mailer')

let transporter: Transporter;

const start = async (options: object) => {
    transporter = await nodemailer.createTransport(options)
}

const send = async (email: SendMailOptions) => {
    const info = await transporter.sendMail(email)
    logger.info(`[$] Outgoing email id: ${info.messageId}`)
}

const close = async () => await transporter.close()

export { SendMailOptions } from 'nodemailer'

export interface Mailer {
    start: Function
    send: Function
    close: Function
}

export const mailer: Mailer = { start, send, close }