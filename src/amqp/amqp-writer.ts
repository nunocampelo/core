const uuidv1 = require('uuid/v1')
import { Connection, Channel } from 'amqplib'
const amqp = require('amqplib')

import { getLogger, Logger } from '../logger'

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
    let connectedPromise: Promise<any>

    const connect = (url: string, exchange: string): Promise<void> => {

        logger.info(`[*] Connecting to exchange ${exchange}`)
        _exchange.name = exchange

        return connectedPromise = amqp.connect(url).then((_connection: Connection) => {
            connection = _connection
            return connection.createChannel()
        }).then((_channel: Channel) => {
            channel = _channel
            return channel.assertExchange(exchange, _exchange.type, _exchange.options)
        }).then(() => logger.info(`[$] Connected successfully to exchange ${exchange}`))
    }

    const write = async (content: object, topic: string): Promise<void> => {

        await connectedPromise

        const messageId = uuidv1()

        logger.info(`[*] Publising message to topic ${topic} with id ${messageId}`)
        const availableBuffer = channel.publish(_exchange.name, topic, Buffer.from(JSON.stringify(content)), { messageId, persistent: true })
        logger.info(`[$] Published message id ${messageId} buffer available ${availableBuffer}`)
    }

    const close = async (): Promise<void> => {

        await connectedPromise

        logger.info(`[*] Closing connection`)

        return channel.close().then(() => connection.close()).then(() => {
            logger.info(`[$] Closed connection`)
        })
    }

    return {
        connect,
        close,
        write
    }
})()
