import { BaseLogger, Logger } from "matrix-js-sdk/lib/logger";

export class LoggerClient implements BaseLogger {
  constructor(private namespace?: string) {}

  debug(...msg) {
    undefined;
  } // console.info(msg.join(" "));

  info(...msg) {
    undefined;
  } // console.info(msg.join(" "));

  warn(...msg) {
    undefined;
  } // console.warn(msg.join(" "));

  error(...msg) {
    undefined;
  } // console.error(msg.join(" "));

  trace(...msg) {
    undefined;
  }

  getChild(namespace: string): Logger {
    return new LoggerClient(namespace);
  }
}

export const loggerClient = new LoggerClient();
