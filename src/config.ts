import { LoginEvent, NavigateEvent } from "./messaging/incoming";

export interface TestBoxConfig {
  allowFullStory?: boolean;
  logLevel?: string;
  targetOrigin?: string;
  linkTargetLoopInterval?: number;
  healthCheckInterval?: number;
  window?: Window;

  navigateHandler?: (url: NavigateEvent) => Promise<void>;
  loginHandler?: (props: LoginEvent) => Promise<string | boolean>;
}

declare global {
  interface Window {
    __tbxConfig?: TestBoxConfig;
  }
}

export function getTargetOrigin() {
  return getConfigItem("targetOrigin") || ".testbox.com";
}

export function getLogLevel() {
  return getConfigItem("logLevel") || "none";
}

export function setConfig<K extends keyof TestBoxConfig>(
  config?: TestBoxConfig
) {
  window.__tbxConfig = config || {};
  return window.__tbxConfig;
}

export function setConfigItem<K extends keyof TestBoxConfig>(
  key: K,
  value: TestBoxConfig[K]
) {
  if (!window.__tbxConfig) {
    console.error("TestBox configuration undefined!");
    return;
  }

  window.__tbxConfig[key] = value;
}

export function getConfigItem<K extends keyof TestBoxConfig>(
  key: K,
  fallback?: TestBoxConfig[K]
): TestBoxConfig[K] {
  return (window.__tbxConfig ? window.__tbxConfig[key] : undefined) || fallback;
}
