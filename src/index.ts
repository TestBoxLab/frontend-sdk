import { getTargetOrigin, TestBoxConfig } from "./config";
import { info } from "./utils/logging";
import {
  isValidIncomingTestBoxMessage,
  sendMessageToTestBox,
} from "./messaging";
import { routeMessage, TestBoxEventRouter } from "./router";
import { INITIALIZE_REQUEST_EVENT } from "./messaging/outgoing";
import { IncomingEventMap } from "./messaging/incoming";

let tbxStarted = false;
let messageHandlers: TestBoxEventRouter = {};

export function startTestBox(config?: TestBoxConfig) {
  if (tbxStarted) {
    return;
  }

  window.__tbxConfig = config;

  if (window.__tbxConfig.onNavigateRequest) {
    messageHandlers["navigate-request"] = [window.__tbxConfig.onNavigateRequest];
  }
  if (window.__tbxConfig.onLoginRequest) {
    messageHandlers["login-request"] = [window.__tbxConfig.onLoginRequest];
  }

  window.addEventListener("message", (ev) => {
    if (!ev.origin.includes(".testbox.com")) {
      info("target-mismatch", {
        messageOrigin: ev.origin,
        targetOrigin: getTargetOrigin(),
      });
      return;
    }

    const { data } = ev;

    if (!isValidIncomingTestBoxMessage(data)) {
      info("not-a-testbox-message", { data });
      return;
    }

    routeMessage(data, messageHandlers);
  });

  sendMessageToTestBox(INITIALIZE_REQUEST_EVENT);
  tbxStarted = true;
}

export const start = startTestBox;

export function on<K extends keyof IncomingEventMap>(
  message: K,
  handler: (message: IncomingEventMap[K]) => void
) {
  if (message in messageHandlers) {
    messageHandlers[message].push(handler);
  }
  else {
    // TODO: TypeScript narrowing does not work here. See if we can fix.
    messageHandlers[message] = [handler as any];
  }
}
