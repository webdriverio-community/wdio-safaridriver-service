import child_process, { ChildProcess } from 'child_process'

export const path = '/usr/bin/safaridriver'

let instance: ChildProcess
export const start = (args: string[]) => {
    instance = child_process.execFile(path, args)
    return instance
}

export const stop = () => {
    if (instance) {
        instance.kill()
    }
}
