import type { TestBoxConfig, LoginHandler } from "./config";
import { sendMessageToTestBox } from "./messaging";
import { INITIALIZE_REQUEST } from "./messaging/outgoing";
import { LoginEvent, NavigateEvent } from "./messaging/incoming";
import { messageEventCallback } from "./message-event";
import { routeMessage } from "./router";

let tbxStarted = false;
let isLoginHandlerRegistered = false;

export let navigateHandler: (data: NavigateEvent) => void = (data) => {
  window.location.href = data.url;
};
export let loginHandler: (data: LoginEvent) => Promise<string | boolean> =
  undefined;
function eventCallbackMiddleware(ev: MessageEvent<any>) {
  messageEventCallback(ev, { navigateHandler, loginHandler });
}

export async function registerLoginHandler(newLoginHandler: LoginHandler) {
  if (isLoginHandlerRegistered) {
    throw new Error("LoginHandler already registered!");
  }

  if (!tbxStarted) {
    throw new Error(
      "StartTestbox function must be called before registering login handler!"
    );
  }

  window.removeEventListener("message", eventCallbackMiddleware);

  loginHandler = newLoginHandler;

  if (window?.__tbxLoginEvent) {
    routeMessage(window?.__tbxLoginEvent, {
      navigate: navigateHandler,
      login: loginHandler,
    });
    window.__tbxLoginEvent = null;
  }

  window.addEventListener("message", eventCallbackMiddleware);

  isLoginHandlerRegistered = true;
}

export function startTestBox(config?: TestBoxConfig) {
  if (tbxStarted) {
    return;
  }

  window.__tbxConfig = config;
  window.__tbxLoginEvent = null;

  if (window.__tbxConfig.navigateHandler) {
    navigateHandler = window.__tbxConfig.navigateHandler;
  }

  if (window.__tbxConfig.loginHandler) {
    loginHandler = window.__tbxConfig.loginHandler;
  }

  window.addEventListener("message", eventCallbackMiddleware);

  sendMessageToTestBox(INITIALIZE_REQUEST);
  tbxStarted = true;
}

export const start = startTestBox;

export { TestBoxConfig };
