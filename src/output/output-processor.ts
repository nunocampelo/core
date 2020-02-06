const Table = require('cli-table')
const createCsvWriter = require('csv-writer').createObjectCsvWriter

import { getLogger, Logger } from '../logger'
const logger: Logger = getLogger('OutputProcessor')

const printCliTable = (records: any[], tableConfig?: any) => {
    
    const table = new Table(tableConfig)

    records.forEach((item: any) => {
        table.push(item)
    })

    console.log(table.toString())
}

const writeCsvFile = async (records: any[], fileConfig : any) => {

    const headers: any = fileConfig.header 
    const csvWriter: any = createCsvWriter(fileConfig)

    const transformedRecords: any[] = records.map((record: any) => {

        return record.reduce((acc: any, cur: any, index: number) => {
            acc[headers[index].id] = cur
            return acc
        }, {})
    })

    await csvWriter.writeRecords(transformedRecords).catch((err: any) => {
        logger.error(`error saving csv file ${err}`)
    })
    logger.info(`csv file saved`)
}

export interface OutputProcessor {
    printCliTable(results: any[], tableConfig: any): void
    writeCsvFile(results: any[], fileConfig: any): Promise<void>
}

export const outputProcessor: OutputProcessor = {
    printCliTable,
    writeCsvFile
}