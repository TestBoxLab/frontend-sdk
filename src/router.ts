import { initializeTestBox } from "./initialize";
import {
  IncomingEventHandlers,
  INITIALIZE,
  LOGIN,
  NAVIGATE,
  UnionedIncomingMessages,
  VALID_INCOMING_EVENTS,
} from "./messaging/incoming";
import { warn } from "./utils/logging";
import { autoLogin } from "./utils/login";
import { sendMessageToTestBox } from "./messaging";
import { INITIALIZE_ACK, LOGIN_ACK, NAVIGATE_ACK } from "./messaging/outgoing";

let loggingIn = false;
let navigateUrl = "";

// Note to future selves: you cannot destructure testbox here, the
// type narrowing does not work correctly if you do so here.
export function routeMessage(
  { testbox }: UnionedIncomingMessages,
  router: Partial<IncomingEventHandlers>
) {
  const { event, data } = testbox;
  if (VALID_INCOMING_EVENTS.includes(event)) {
    switch (event) {
      case INITIALIZE:
        sendMessageToTestBox(INITIALIZE_ACK);
        initializeTestBox(data);
        break;
      case NAVIGATE:
        sendMessageToTestBox(NAVIGATE_ACK);
        if (loggingIn) {
          navigateUrl = data.url;
        } else {
          const func = router["navigate"];
          if (func) {
            func(data);
          }
        }
        break;
      case LOGIN:
        loggingIn = true;
        sendMessageToTestBox(LOGIN_ACK);
        autoLogin(data, router).then((nextUrl: string | boolean) => {
          loggingIn = false;
          const goTo = navigateUrl || nextUrl;
          if (
            goTo &&
            typeof goTo == "string" &&
            goTo !== window.location.href
          ) {
            const func = router["navigate"];
            if (func) {
              func({ url: goTo });
            }
          }
        });
        break;
      default:
        warn("no-route");
    }
  }
}
