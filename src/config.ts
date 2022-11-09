export interface TestBoxConfig {
  logLevel?: string;
  targetOrigin?: string;
  linkTargetLoopInterval?: number;
  healthCheckInterval?: number;
}

declare global {
  interface Window {
    __tbxConfig?: TestBoxConfig;
  }
}

export function getTargetOrigin() {
  return window.__tbxConfig?.targetOrigin || "https://app.testbox.com";
}

export function getLogLevel() {
  return window.__tbxConfig.logLevel || "none";
}

export function getConfigItem<K extends keyof TestBoxConfig>(
  key: K,
  fallback?: TestBoxConfig[K]
): TestBoxConfig[K] {
  return window.__tbxConfig[key] || fallback;
}
