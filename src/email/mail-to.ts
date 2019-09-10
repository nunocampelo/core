
const fs = require('fs')
import { shell } from '../shell'

const appRoot = require('app-root-path')

const open = (to: string, subject: string = '', body: string = '', contentType: string = 'text/plain') => {

    const content: string = `To: ${to}
Subject: ${subject}
X-Unsent: 1
Content-Type: ${contentType}

${body}`

    const messageFile: string = shell.toCmdPath(`${appRoot.path}\\resources\\temp\\email\\message.eml`)

    fs.writeFile(messageFile, content, (err: any) => {
        shell.exec(`start "" "${messageFile}"`)
    })
}

export const mailTo: MailTo = {
    open
}

export interface MailTo {
    open(to: string, subject: string, body: string, contentType: string): void
}