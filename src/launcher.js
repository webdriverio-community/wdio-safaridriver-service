import fs from 'fs-extra'
import SafariDriver from './safaridriver'

import getFilePath from './utils/getFilePath'

const DEFAULT_LOG_FILENAME = 'SafariDriver.txt'

export default class SafariDriverLauncher {
    constructor () {
        this.safariDriverLogs = null
        this.safariDriverArgs = null
        this.logToStdout = false

        return this
    }

    onPrepare (config) {
        this.safariDriverArgs = config.safariDriverArgs || []
        this.safariDriverLogs = config.safariDriverLogs

        if (!this.safariDriverArgs.find(arg => arg.startsWith('-p')) && config.port) {
            this.safariDriverArgs.push(`-p ${config.port}`)
        }

        this.process = SafariDriver.start(this.safariDriverArgs)

        if (typeof this.safariDriverLogs === 'string') {
            this._redirectLogStream()
        }
    }

    onComplete () {
        SafariDriver.stop()
    }

    _redirectLogStream () {
        const logFile = getFilePath(this.safariDriverLogs, DEFAULT_LOG_FILENAME)

        // ensure file & directory exists
        fs.ensureFileSync(logFile)

        const logStream = fs.createWriteStream(logFile, { flags: 'w' })
        this.process.stdout.pipe(logStream)
        this.process.stderr.pipe(logStream)
    }
}
