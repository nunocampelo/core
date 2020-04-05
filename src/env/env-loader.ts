
const load = (envFilePath: string = `.env`) => {
    require('dotenv').config({ path: envFilePath })
}

export interface EnvLoader {
    load(envFilePath?: string): void
}

export const envLoader: EnvLoader = {
    load
}