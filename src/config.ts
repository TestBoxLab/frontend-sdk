import type {
  LoginEvent,
  LoginMessage,
  NavigateEvent,
} from "./messaging/incoming";

export type LoginHandler = (props: LoginEvent) => Promise<string | boolean>;
export type RegisterLoginHandler = (
  loginHandlerFunc: LoginHandler
) => Promise<string | boolean>;

export interface TestBoxConfig {
  allowFullStory?: boolean;
  logLevel?: string;
  targetOrigin?: string;
  loginHandler?: LoginHandler;
  linkTargetLoopInterval?: number;
  healthCheckInterval?: number;
  window?: Window;

  navigateHandler?: (url: NavigateEvent) => Promise<void>;
}

declare global {
  interface Window {
    __tbxConfig?: TestBoxConfig;
    __tbxLoginEvent?: LoginMessage;
  }
}

export function getTargetOrigin() {
  return window.__tbxConfig?.targetOrigin || "localhost";
}

export function getLogLevel() {
  return window.__tbxConfig.logLevel || "none";
}

export function getConfigItem<K extends keyof TestBoxConfig>(
  key: K,
  fallback?: TestBoxConfig[K]
): TestBoxConfig[K] {
  return (window.__tbxConfig ? window.__tbxConfig[key] : undefined) || fallback;
}
