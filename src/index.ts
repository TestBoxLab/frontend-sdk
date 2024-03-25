import type { TestBoxConfig, LoginHandler } from "./config";
import { sendMessageToTestBox } from "./messaging";
import { INITIALIZE_REQUEST, LOGIN_HANDLER_REGISTERED } from "./messaging/outgoing";
import { LoginEvent, NavigateEvent } from "./messaging/incoming";
import { messageEventCallback } from "./message-event"
import { routeMessage } from "./router";

let tbxStarted = false;
let isLoginHandlerRegistered = false;

export let navigateHandler: (data: NavigateEvent) => void = (data) => {
  window.location.href = data.url;
};;
export let loginHandler: (
  data: LoginEvent
) => Promise<string | boolean> = undefined;
function eventCallbackMiddleware(ev: MessageEvent<any>) {
  messageEventCallback(ev, { navigateHandler, loginHandler })
}

export async function registerLoginHandler(newLoginHandler: LoginHandler) {
  if (isLoginHandlerRegistered) {
    throw new Error("LoginHandler already registered!")
  }

  if (!tbxStarted) {
    throw new Error("StartTestbox function must be called before registering login handler!")
  }

  window.removeEventListener(
    "message",
    eventCallbackMiddleware
  )

  loginHandler = newLoginHandler

  if (window?.__loginMessagesQueue && window.__loginMessagesQueue.length > 0) {
    for (const loginMessage of window.__loginMessagesQueue) {
      routeMessage(
        loginMessage,
        {
          navigate: navigateHandler,
          login: loginHandler
        }
      )
    }
    window.__loginMessagesQueue = []
  }

  window.addEventListener(
    "message",
    eventCallbackMiddleware
  )

  sendMessageToTestBox(LOGIN_HANDLER_REGISTERED)
  isLoginHandlerRegistered = true;
}

export function startTestBox(config?: TestBoxConfig) {
  if (tbxStarted) {
    return;
  }

  window.__tbxConfig = config;
  window.__loginMessagesQueue = [];

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

  if (!isLoginHandlerRegistered){
    window.addEventListener("message", eventCallbackMiddleware)
  }

  sendMessageToTestBox(INITIALIZE_REQUEST);
  tbxStarted = true;
}

export const start = startTestBox;

export { TestBoxConfig };

