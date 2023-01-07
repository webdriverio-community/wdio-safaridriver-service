import fs from 'fs-extra'
import split2 from 'split2'
import logger from '@wdio/logger'
import tcpPortUsed from 'tcp-port-used'
import safaridriver, { DEFAULT_PORT } from 'safaridriver'
import { SevereServiceError } from 'webdriverio'
import type { ChildProcess } from 'child_process'
import type { Options } from '@wdio/types'

import { getFilePath } from './utils.js'
import { pkg } from './constants.js'
import type { ServiceOptions } from './types'

const POLL_INTERVAL = 100
const POLL_TIMEOUT = 10000

const log = logger('wdio-safaridriver-service')

export default class SafariDriverLauncher {
    private _process?: ChildProcess
    private _outputDir: string

    constructor (
        private _options: ServiceOptions,
        _: never,
        private _config: Options.Testrunner
    ) {
        log.info(`Initiate Safaridriver Service (v${pkg.version})`)
        this._outputDir = this._options.outputDir || this._config.outputDir || process.cwd()
    }

    public async onPrepare () {
        const port = this._options.port || DEFAULT_PORT
        log.info(`Start Safaridriver on port ${port}`)
        this._process = safaridriver.start(this._options)

        if (typeof this._outputDir === 'string') {
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
        const logFile = getFilePath(this._outputDir, this._options.logFileName)
        await fs.ensureFile(logFile)

        const logStream = fs.createWriteStream(logFile, { flags: 'w' })
        this._process?.stdout?.pipe(logStream)
        this._process?.stderr?.pipe(logStream)
    }
}
