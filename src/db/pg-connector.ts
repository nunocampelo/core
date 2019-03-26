import { Pool } from 'pg';

let pool: Pool;

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

const close = () => pool.end()

export interface Pg {
    connect: Function
    query: Function
    close: Function
}

export { QueryResult } from 'pg'

export const pg: Pg = {
    connect, query, close
}