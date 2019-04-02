const uuidv1 = require('uuid/v1')
import { Connection, Channel } from 'amqplib'
const amqp = require('amqplib')

import { getLogger, Logger } from '../logger/logger'

const logger: Logger = getLogger('AMQPWriter')

const _exchange = {
    name: '',
    type: 'topic',
    options: { durable: true }
}

export interface AMQPWriter {
    connect: Function
    write: Function
    close: Function
}

export const amqpWriter: AMQPWriter = (() => {

    let connection: Connection
    let channel: Channel

    const connect = async (url: string, exchange: string) => {

        _exchange.name = exchange

        connection = await amqp.connect(url)
        channel = await connection.createChannel()

        logger.info(`[*] Connecting to exchange ${exchange}`)

        return channel.assertExchange(exchange, _exchange.type, _exchange.options)
    }

    const close = () => {
        return Promise.all([channel.close(), connection.close()])
    }

    const write = (content: object, topic: string) => {
        const messageId = uuidv1()
        logger.info(`[>] Publising message to topic ${topic} with id ${messageId}`)
        return channel.publish(_exchange.name, topic, Buffer.from(JSON.stringify(content)), { messageId, persistent: true })
    }

    return {
        connect,
        close,
        write
    }
})()
