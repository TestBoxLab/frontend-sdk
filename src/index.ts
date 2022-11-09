import { getTargetOrigin } from "./config";
import { info } from "./utils/logging";
import {
  isValidIncomingTestBoxMessage,
  sendMessageToTestBox,
} from "./messaging";
import { routeMessage } from "./router";
import { INITIALIZE_REQUEST_EVENT } from "./messaging/outgoing";

window.addEventListener("message", (ev) => {
  if (ev.origin !== getTargetOrigin()) {
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

  routeMessage(data);
});

sendMessageToTestBox(INITIALIZE_REQUEST_EVENT);
