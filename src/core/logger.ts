export default class Logger {
  constructor(private context?: string) {}

  private formatMessage(level: string, message: any) {
    const timestamp = new Date().toLocaleString();
    const ctx = this.context ? `[${this.context}]` : '';
    return `${timestamp} ${level} ${ctx} ${message}`;
  }

  log(message: any) {
    console.log(`\x1b[32m${this.formatMessage('LOG', message)}\x1b[0m`);
  }

  error(message: any, trace?: string) {
    console.error(`\x1b[31m${this.formatMessage('ERROR', message)}\x1b[0m`);
    if (trace) console.error(trace);
  }

  warn(message: any) {
    console.warn(`\x1b[33m${this.formatMessage('WARN', message)}\x1b[0m`);
  }

  debug(message: any) {
    console.debug(`\x1b[34m${this.formatMessage('DEBUG', message)}\x1b[0m`);
  }

  verbose(message: any) {
    console.log(`\x1b[35m${this.formatMessage('VERBOSE', message)}\x1b[0m`);
  }
}
