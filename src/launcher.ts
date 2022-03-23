import fs from 'fs-extra'
import type { ChildProcess } from 'child_process'

import { start, stop } from './safaridriver'

import { getFilePath } from './utils'
import type { ServiceOptions } from './types'

export default class SafariDriverLauncher {
    private _process?: ChildProcess

    constructor (private _options: ServiceOptions) {}

    public onPrepare () {
        const args = this._options.args || []

        if (!args.find((arg) => arg.startsWith('-p')) && typeof this._options.port === 'number') {
            args.push(`-p ${this._options.port}`)
        }

        this._process = start(args)

        if (typeof this._options.outputDir === 'string') {
            this._redirectLogStream()
        }
    }

    public onComplete () {
        return stop()
    }

    private _redirectLogStream () {
        const logFile = getFilePath(this._options.outputDir!)
        const logStream = fs.createWriteStream(logFile, { flags: 'w' })

        this._process?.stdout?.pipe(logStream)
        this._process?.stderr?.pipe(logStream)
    }
}
