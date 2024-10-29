import { getLogLevel } from "../config";

export enum LogLevel {
  none = 0,
  error = 1,
  warn = 2,
  info = 3,
  debug = 4,
}

function logLevel() {
  switch (getLogLevel()) {
    case "none":
      return LogLevel.none;
    case "debug":
      return LogLevel.debug;
    case "info":
      return LogLevel.info;
    case "warn":
      return LogLevel.warn;
    case "error":
      return LogLevel.error;
  }
  throw Error("No log level known");
}

export function info(event: string, payload?: Object) {
  if (logLevel() >= LogLevel.info) {
    let logContent: string = payload
      ? JSON.stringify({ event, ...payload })
      : event;
    console.info(`[TBX SDK]: ${logContent}`);
  }
}

export function debug(event: string, payload?: Object) {
  if (logLevel() >= LogLevel.debug) {
    let logContent: string = payload
      ? JSON.stringify({ event, ...payload })
      : event;
    console.debug(`[TBX SDK]: ${logContent}`);
  }
}

export function warn(event: string, payload?: Object) {
  if (logLevel() >= LogLevel.warn) {
    let logContent: string = payload
      ? JSON.stringify({ event, ...payload })
      : event;
    console.warn(`[TBX SDK]: ${logContent}`);
  }
}

export function error(event: string, payload?: Object) {
  if (logLevel() >= LogLevel.error) {
    let logContent: string = payload
      ? JSON.stringify({ event, ...payload })
      : event;
    console.error(`[TBX SDK]: ${logContent}`);
  }
}
