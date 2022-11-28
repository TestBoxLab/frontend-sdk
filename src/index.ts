import { getTargetOrigin, TestBoxConfig } from "./config";
import { info } from "./utils/logging";
import {
  isValidIncomingTestBoxMessage,
  sendMessageToTestBox,
} from "./messaging";
import { routeMessage } from "./router";
import { INITIALIZE_REQUEST } from "./messaging/outgoing";
import { LoginEvent, NavigateEvent } from "./messaging/incoming";

let tbxStarted = false;

export let navigateHandler: (data: NavigateEvent) => void;
export let loginHandler: (
  data: LoginEvent
) => Promise<string | boolean> = async () => false;

export function startTestBox(config?: TestBoxConfig) {
  if (tbxStarted) {
    return;
  }

  window.__tbxConfig = config;

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

  window.addEventListener("message", (ev) => {
    const targetOrigin = getTargetOrigin();
    if (!ev.origin.includes(targetOrigin)) {
      info("target-mismatch", {
        messageOrigin: ev.origin,
        targetOrigin: targetOrigin,
      });
      return;
    }

    const { data } = ev;

    if (!isValidIncomingTestBoxMessage(data)) {
      info("not-a-testbox-message", { data });
      return;
    }

    routeMessage(data, {
      navigate: navigateHandler,
      login: loginHandler,
    });
  });

  sendMessageToTestBox(INITIALIZE_REQUEST);
  tbxStarted = true;
}

export const start = startTestBox;

export { TestBoxConfig };
