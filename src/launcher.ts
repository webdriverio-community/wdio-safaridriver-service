import fs from 'fs-extra'
import { spawn, ChildProcess } from 'child_process'
import split2 from 'split2'
import logger from '@wdio/logger'
import tcpPortUsed from 'tcp-port-used'
import { SevereServiceError } from 'webdriverio'

import { getFilePath } from './utils'
import type { ServiceOptions } from './types'

const POLL_INTERVAL = 100
const POLL_TIMEOUT = 10000
const DEFAULT_PORT = 4444

const log = logger('wdio-safaridriver-service')

export default class SafariDriverLauncher {
    private _process?: ChildProcess

    constructor (private _options: ServiceOptions) {}

    public async onPrepare () {
        const args = this._options.args || []
        const port = this._options.port || DEFAULT_PORT

        if (!args.find((arg) => arg.startsWith('-p'))) {
            args.push(`-p ${port}`)
        }

        log.info(`Start Safaridriver with args ${args.join(' ')}`)
        this._process = spawn('safaridriver', args)

        if (typeof this._options.outputDir === 'string') {
            await this._redirectLogStream()
        } else {
            this._process.stdout?.pipe(split2()).on('data', log.info.bind(this))
            this._process.stderr?.pipe(split2()).on('data', log.warn.bind(this))
        }

        try {
            await tcpPortUsed.waitUntilUsed(port, POLL_INTERVAL, POLL_TIMEOUT)
        } catch (err: any) {
            throw new SevereServiceError(`Couldn't start Safaridriver: ${err.message}`)
        }

        process.on('exit', this.onComplete.bind(this))
        process.on('SIGINT', this.onComplete.bind(this))
        process.on('uncaughtException', this.onComplete.bind(this))
    }

    public onComplete () {
        if (this._process) {
            this._process.kill()
        }
    }

    private async _redirectLogStream () {
        const logFile = getFilePath(this._options.outputDir!)
        await fs.ensureFile(logFile)

        const logStream = fs.createWriteStream(logFile, { flags: 'w' })
        this._process?.stdout?.pipe(logStream)
        this._process?.stderr?.pipe(logStream)
    }
}
