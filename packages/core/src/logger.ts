import pino from 'pino'
import { Server } from 'socket.io'

const isDebugEnabled = () => process.env.LOG_LEVEL === 'debug'

export class BaseLogger {
  private logger: pino.Logger

  constructor(private readonly meta: Record<string, unknown> = {}) {
    this.logger = pino({
      level: process.env.LOG_LEVEL || 'info',
      formatters: { level: (level) => ({ level }) },
      base: null,
      mixin: () => meta,
    })
  }

  child(meta: Record<string, unknown> = {}): this {
    return new BaseLogger({ ...this.meta, ...meta }) as this
  }

  info(message: string, args?: unknown) {
    this.logger.info(args, message)
  }

  error(message: string, args?: unknown) {
    this.logger.error(args, message)
  }

  debug(message: string, args?: unknown) {
    this.logger.debug(args, message)
  }

  warn(message: string, args?: unknown) {
    this.logger.warn(args, message)
  }

  log(args: unknown) {
    this.logger.info(args)
  }
}

export class Logger extends BaseLogger {
  private emitLog: (level: string, msg: string, args?: unknown) => void

  constructor(
    private readonly traceId: string,
    private readonly flows: string[] | undefined,
    private readonly step: string,
    private readonly socketServer?: Server,
  ) {
    super({ traceId, flows, step })

    this.emitLog = (level: string, msg: string, args?: unknown) => {
      socketServer?.emit('log', {
        step: this.step,
        ...(args ?? {}),
        level,
        time: Date.now(),
        msg,
        traceId: this.traceId,
        flows: this.flows,
      })
    }
  }

  child(meta: Record<string, unknown> = {}): this {
    return new Logger(this.traceId, this.flows, meta.step as string, this.socketServer) as this
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  log(message: any) {
    console.log(JSON.stringify(message))
    this.emitLog(message.level, message.msg, message)
  }

  info = (message: string, args?: unknown) => {
    super.info(message, args)
    this.emitLog('info', message, args)
  }

  error = (message: string, args?: unknown) => {
    super.error(message, args)
    this.emitLog('error', message, args)
  }

  debug = (message: string, args?: unknown) => {
    super.debug(message, args)
    if (isDebugEnabled()) {
      this.emitLog('debug', message, args)
    }
  }

  warn = (message: string, args?: unknown) => {
    super.warn(message, args)
    this.emitLog('warn', message, args)
  }
}

export const globalLogger = new BaseLogger()
