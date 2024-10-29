import type { TestBoxConfig, LoginHandler } from "./config";
import { sendMessageToTestBox } from "./messaging";
import { INITIALIZE_REQUEST } from "./messaging/outgoing";
import { LoginEvent, NavigateEvent } from "./messaging/incoming";
import { messageHandler } from "./message-event";
import { routeMessage } from "./router";
import { info, warn } from "./utils/logging";

let tbxStarted = false;

export let navigateHandler: (data: NavigateEvent) => void;
export let loginHandler: (data: LoginEvent) => Promise<string | boolean> =
  undefined;

function messageEventCallback(ev: MessageEvent<any>) {
  messageHandler(ev, { navigateHandler, loginHandler });
}

export async function registerLoginHandler(newLoginHandler: LoginHandler) {
  if (loginHandler) {
    warn("Login handler already registered!");
  }

  if (!tbxStarted) {
    throw new Error(
      "startTestBox function must be called before registering login handler!"
    );
  }

  window.removeEventListener("message", messageEventCallback);

  loginHandler = newLoginHandler;

  if (window?.__tbxLoginEvent) {
    routeMessage(window?.__tbxLoginEvent, {
      navigate: navigateHandler,
      login: loginHandler,
    });
    window.__tbxLoginEvent = null;
  }

  window.addEventListener("message", messageEventCallback);
}

export function startTestBox(config?: TestBoxConfig) {
  // Verifications
  if (tbxStarted) {
    info("SDK already started");
    return;
  }

  window.__tbxConfig = config;
  info("Starting SDK...");

  if (window.__tbxExtensionActive && !config.startedByExtension) {
    // Checking for Extension
    warn(
      "Extension is Active and SDK start had a different origin. Blocking SDK start"
    );
    return;
  }

  // Handlers
  window.__tbxLoginEvent = null;
  if (window.__tbxConfig.navigateHandler) {
    navigateHandler = window.__tbxConfig.navigateHandler;
  } else {
    navigateHandler = (data) => {
      window.location.href = data.url;
    };
  }

  if (window.__tbxConfig.loginHandler) {
    loginHandler = window.__tbxConfig.loginHandler;
  }

  window.addEventListener("message", messageEventCallback);
  sendMessageToTestBox(INITIALIZE_REQUEST);
  tbxStarted = true;
  info("SDK Started!");
}

export const start = startTestBox;

export { TestBoxConfig };
