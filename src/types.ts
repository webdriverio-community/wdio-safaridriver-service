export interface ServiceOptions {
    /**
     * The port on which the driver should run on.
     */
    port?: number
    /**
     * The path where the output of the Safaridriver server should
     * be stored (uses the `config.outputDir` by default when not set).
     */
    outputDir?: string
    /**
     * The name of the log file to be written in outputDir.
     */
    logFileName?: string
    /**
     * Array of arguments to pass to the safaridriver executable.
     * `-p` will use wdioConfig.port if not specified.
     */
    args?: string[]
}
