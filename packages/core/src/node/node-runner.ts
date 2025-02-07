import path from 'path'
import { Logger } from './logger'
import { RpcStateManager } from './rpc-state-manager'
import { RpcSender } from './rpc'

// Add ts-node registration before dynamic imports
// eslint-disable-next-line @typescript-eslint/no-require-imports
require('ts-node').register({
  transpileOnly: true,
  compilerOptions: { module: 'commonjs' },
})

function parseArgs(arg: string) {
  try {
    return JSON.parse(arg)
  } catch {
    return arg
  }
}

async function runTypescriptModule(filePath: string, event: Record<string, unknown>) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const module = require(path.resolve(filePath))

    // Check if the specified function exists in the module
    if (typeof module.handler !== 'function') {
      throw new Error(`Function handler not found in module ${filePath}`)
    }

    const { traceId, flows } = event
    const sender = new RpcSender(process)
    const logger = new Logger(traceId as string, flows as string[], sender)
    const state = new RpcStateManager(sender)

    const emit = async (data: unknown) => sender.send('emit', data)
    const context = { traceId, flows, logger, state, emit }

    sender.init()

    // Call the function with provided arguments
    const result = await module.handler(event.data, context)

    await sender.send('result', result)
    await sender.close()

    process.exit(0)
  } catch (error) {
    console.error('Error running TypeScript module:', error)
    process.exit(1)
  }
}

const [, , filePath, arg] = process.argv

if (!filePath) {
  console.error('Usage: node nodeRunner.js <file-path> <arg>')
  process.exit(1)
}

runTypescriptModule(filePath, parseArgs(arg)).catch((err) => {
  console.error('Error:', err)
  process.exit(1)
})
