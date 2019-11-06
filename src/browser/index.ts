const puppeteer = require('puppeteer')
import { Browser as puppeteerBrowser } from 'puppeteer'

import { dateUtils } from '../date/date-utils'

const clip = async (url: string, selector: string, options: any, path?: string, padding: number = 0) => {

    const browser: puppeteerBrowser = await puppeteer.launch(options)
    // const browser: puppeteerBrowser = await puppeteer.launch({ headless: false, executablePath: "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe" });
    const page = await browser.newPage()

    await page.setViewport({
        width: 1920,
        height: 1080,
        deviceScaleFactor: 1,
    })

    await page.goto(url);

    const rect: any = await page.evaluate((selector: string) => {
        const element: any = document.querySelector(selector);
        if (!element)
            return null
        const { x, y, width, height } = element.getBoundingClientRect()
        return { left: x, top: y, width, height, id: element.id }
    }, selector)

    if (!rect) {
        throw Error(`Could not find element that matches selector: ${selector}.`)
    }

    await page.screenshot({
        path: `clip-${dateUtils.currentDateTime()}.png`,
        clip: {
            x: rect.left - padding,
            y: rect.top - padding,
            width: rect.width + padding * 2,
            height: rect.height + padding * 2
        }
    })

    // await page.screenshot({ path: 'example.png' });

    await browser.close()
}

export interface Browser {
    clip(url: string, selector: string, options: any, path?: string, padding?: number): void
}

export const browser: Browser = {
    clip
}