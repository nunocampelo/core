const snapshot = (url: string, path?: string, selector?: string) => {

}

export interface Browser {
    snapshot(url: string, path?: string, selector?: string): void
}

export const browser: Browser = {
    snapshot
}