import { getLogger, Logger } from '../logger/logger'

import { Connection, Channel, ConsumeMessage, Replies } from 'amqplib'
const amqp = require('amqplib')

const logger: Logger = getLogger('AMQPReader')

const _exchange = {
    name: '',
    type: 'topic',
    options: { durable: true }
}

const _queueOptions = {
    name: '',
    options: { exclusive: true }
}

interface Topic {
    name: string
    queue: string
    channel: any
}

export interface AMQPReader {
    connect: Function
    bind: Function
    close: Function
}

export const reader: AMQPReader = (() => {

    let connection: Connection
    let _topics: Array<Topic>;
    let _topicsObj: any = {};


    const connect = async (url: string, exchange: string, topics: Array<string>) => {

        _exchange.name = exchange
        connection = await amqp.connect(url)

        // one needs one channel for each topic
        _topics = await Promise.all(topics.map(async (name) => {

            const channel: Channel = await connection.createChannel()
            const assertExchange: Replies.AssertExchange = await channel.assertExchange(exchange, _exchange.type, _exchange.options)

            const assertQueue: Replies.AssertQueue = await channel.assertQueue(_queueOptions.name, _queueOptions.options)

            await channel.bindQueue(assertQueue.queue, assertExchange.exchange, name)
            logger.info(`[*] Connected to ${assertQueue.queue} with topic ${name}`)

            const topic: Topic = {
                name,
                queue: assertQueue.queue,
                channel: channel
            }

            _topicsObj[name] = topic

            return topic
        }))
    }

    const close = async () => {
        await Promise.all(_topics.map((topic: Topic) => topic.channel.close()))
        await connection.close()
    }

    const bind = (topic: string, fn: Function) => {

        const _topic: Topic = _topicsObj[topic]

        if (!_topic) {
            logger.error(`[x] Topic ${topic} couldn't be found`)
            return
        }

        _topic.channel.consume(_topic.queue, async (msg: ConsumeMessage | null) => {

            if (!msg) {
                _topic.channel.ack(msg)
                logger.error(`[x] Invalid nessage ${msg}`)
                return
            }

            const messageId = msg.properties.messageId;

            if (!messageId) {
                _topic.channel.ack(msg)
                logger.error(`[x] Invalid nessage id ${messageId}`)
                return
            }

            logger.info(`[<] Incomming @${_topic.name} message id: ${messageId}`)

            try {

                await fn(JSON.parse(msg.content.toString()), msg.properties)
                logger.info(`[$] Processed message id: ${messageId}`)

            } catch (err) {
                logger.error(`[x] Couldn't parse \n${msg.content.toString()} \nGot error ${err}`)
            }

            _topic.channel.ack(msg)
        })
    }

    return {
        connect,
        bind,
        close
    }
})()
