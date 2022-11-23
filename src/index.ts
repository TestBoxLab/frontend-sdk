import { getTargetOrigin, TestBoxConfig } from "./config";
import { info } from "./utils/logging";
import {
  isValidIncomingTestBoxMessage,
  sendMessageToTestBox,
} from "./messaging";
import { routeMessage, TestBoxEventRouter } from "./router";
import { INITIALIZE_REQUEST } from "./messaging/outgoing";
import { IncomingEventHandlers, IncomingEventMap } from "./messaging/incoming";

let tbxStarted = false;
let messageHandlers: TestBoxEventRouter = {};

export function startTestBox(config?: TestBoxConfig) {
  if (tbxStarted) {
    return;
  }

  window.__tbxConfig = config;

  if (window.__tbxConfig.onNavigate) {
    messageHandlers["navigate"] = [window.__tbxConfig.onNavigate];
  } else {
    messageHandlers["navigate"] = [
      (data) => {
        window.location.href = data.url;
      },
    ];
  }

  if (window.__tbxConfig.onLogin) {
    messageHandlers["login"] = [window.__tbxConfig.onLogin];
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

    routeMessage(data, messageHandlers);
  });

  sendMessageToTestBox(INITIALIZE_REQUEST);
  tbxStarted = true;
}

export const start = startTestBox;

export function on<K extends keyof IncomingEventHandlers>(
  message: K,
  handler: IncomingEventHandlers[K]
) {
  if (message in messageHandlers) {
    messageHandlers[message].push(handler);
  } else {
    // TODO: TypeScript narrowing does not work here. See if we can fix.
    messageHandlers[message] = [handler as any];
  }
}

export { TestBoxConfig };
