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
  loginEventFallbackInMilliseconds?: number;
  linkTargetLoopInterval?: number;
  healthCheckInterval?: number;
  startedByExtension?: boolean;
  window?: Window;
  navigateHandler?: (url: NavigateEvent) => Promise<void>;
}

declare global {
  interface Window {
    __tbxConfig?: TestBoxConfig;
    __tbxLoginEvent?: LoginMessage;
    __tbxExtensionActive?: boolean;
  }
}

export function getTargetOrigin() {
  return window.__tbxConfig?.targetOrigin || ".testbox.com";
}

export function getLogLevel() {
  return window.__tbxConfig?.logLevel || "none";
}

export function getConfigItem<K extends keyof TestBoxConfig>(
  key: K,
  fallback?: TestBoxConfig[K]
): TestBoxConfig[K] {
  return (window.__tbxConfig ? window.__tbxConfig[key] : undefined) || fallback;
}
