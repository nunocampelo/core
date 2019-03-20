const uuidv1 = require('uuid/v1');

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

export const writer: AMQPWriter = (() => {

    let connection: Connection
    let channel: Channel

    const connect = async (url: string, exchange: string) => {

        _exchange.name = exchange

        connection = await amqp.connect(url)
        channel = await connection.createChannel()
        await channel.assertExchange(exchange, _exchange.type, _exchange.options)
        logger.info(`[*] Connected to exchange ${exchange}`)
    }

    const close = async () => {
        await channel.close();
        await connection.close()
    }

    const write = async (content: object, topic: string) => {
        const messageId = uuidv1()
        await channel.publish(_exchange.name, topic, Buffer.from(JSON.stringify(content)), { messageId, persistent: true })
        logger.info(`[>] Published message to topic ${topic} with id ${messageId}`)
    }

    return {
        connect,
        close,
        write
    }
})()
