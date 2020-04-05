const load = (context: string | undefined) => context ? require('config').get(context) : require('config')

export interface ConfigLoader {
    load(configFilePath?: string): any
}

export const configLoader: ConfigLoader = {
    load
}