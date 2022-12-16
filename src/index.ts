import {
  getConfigItem,
  getTargetOrigin,
  setConfig,
  TestBoxConfig,
} from "./config";
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

  setConfig(config);

  const _navigateHandler = getConfigItem("navigateHandler");
  if (typeof _navigateHandler === "function") {
    navigateHandler = (data) => {
      return _navigateHandler(data);
    };
  } else {
    navigateHandler = (data) => {
      window.location.href = data.url;
    };
  }

  const _loginHandler = getConfigItem("loginHandler");
  if (typeof _loginHandler === "function") {
    loginHandler = async (data) => {
      return await _loginHandler(data);
    };
  }

  window.addEventListener("message", (ev) => {
    const targetOrigin = getTargetOrigin();
    if (targetOrigin && !ev.origin.includes(targetOrigin)) {
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
