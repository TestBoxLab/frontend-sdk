import { getTargetOrigin, LoginHandler } from "./config";
import { info } from "./utils/logging";
import { isValidIncomingTestBoxMessage } from "./messaging";
import { routeMessage } from "./router";
import { LoginEvent, NavigateEvent } from "./messaging/incoming";

interface MessageEventCallback {
  navigateHandler: (data: NavigateEvent) => void;
  loginHandler: (props: LoginEvent) => Promise<string | boolean>;
}

export const messageEventCallback = (
  ev: globalThis.MessageEvent<any>,
  { loginHandler, navigateHandler }: MessageEventCallback
) => {
  if (!ev) {
    return;
  }

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
    ...(loginHandler && typeof loginHandler === "function"
      ? { login: loginHandler }
      : {}),
  });
};
