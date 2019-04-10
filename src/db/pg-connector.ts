import { Pool } from 'pg';

import { getLogger, Logger } from '../logger/logger'

let pool: Pool
const logger: Logger = getLogger('PgConnector')

const connect = (host: string, database: string, user: string, password: string, port: number) => {
    pool = new Pool({
        user,
        host,
        database,
        password,
        port
    })
}

const query = (query: string) => pool.query(query)

const close = () => pool.end().then(() => logger.info(`[$] Closed db connection`))

export interface Pg {
    connect: Function
    query: Function
    close: Function
}

export { QueryResult } from 'pg'

export const pg: Pg = {
    connect, query, close
}