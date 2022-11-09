import { getLogLevel } from "../config";

export enum LogLevel {
  none = 0,
  debug = 1,
  info = 2,
  warn = 3,
  error = 4,
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

export function info(event: string, ...payload: any) {
  if (logLevel() >= LogLevel.info) {
    console.info(JSON.stringify({ event, ...payload }));
  }
}

export function debug(event: string, ...payload: any) {
  if (logLevel() >= LogLevel.debug) {
    console.debug(JSON.stringify({ event, ...payload }));
  }
}

export function warn(event: string, ...payload: any) {
  if (logLevel() >= LogLevel.warn) {
    console.warn(JSON.stringify({ event, ...payload }));
  }
}

export function error(event: string, ...payload: any) {
  if (logLevel() >= LogLevel.error) {
    console.error(JSON.stringify({ event, ...payload }));
  }
}
