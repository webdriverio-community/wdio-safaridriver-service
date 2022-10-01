exports.default = class SafariService {}
exports.launcher = class CJSSafaridriverLauncher {
    private instance: Promise<{ onPrepare: () => void, onComplete: () => void }>

    constructor (options: any, capabilities: any, config: any) {
        this.instance = import('../launcher.js').then((SafaridriverLauncher) => (
            // eslint-disable-next-line new-cap, @typescript-eslint/no-unsafe-argument
            new SafaridriverLauncher.default(options, undefined as never, config)
        ))
    }

    async onPrepare () {
        const instance = await this.instance
        return instance.onPrepare()
    }

    async onComplete () {
        const instance = await this.instance
        return instance.onComplete()
    }
}
