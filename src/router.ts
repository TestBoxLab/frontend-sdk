import { initializeTestBox } from "./initialize";
import {
  IncomingEventMap,
  INITIALIZE,
  LOGIN_REQUEST,
  NAVIGATE_REQUEST_EVENT,
  UnionedIncomingMessages,
  VALID_INCOMING_EVENTS,
} from "./messaging/incoming";
import { info, warn } from "./utils/logging";
import { autoLogin } from "./utils/login";

export type TestBoxEventRouter = {
  [K in keyof IncomingEventMap]?: ((data: IncomingEventMap[K]) => void)[];
};

// Note to future selves: you cannot destructure testbox here, the
// type narrowing does not work correctly if you do so here.
export function routeMessage(
  { testbox }: UnionedIncomingMessages,
  router: TestBoxEventRouter
) {
  const { event, data } = testbox;
  if (VALID_INCOMING_EVENTS.includes(event)) {
    switch (event) {
      case INITIALIZE:
        initializeTestBox(data);
        break;
      case NAVIGATE_REQUEST_EVENT:
        window.location.href = data.url;
        break;
      case LOGIN_REQUEST:
        autoLogin(data, router).then((nextUrl) => {
          if (nextUrl && nextUrl !== window.location.href) {
            window.location.href = nextUrl;
          }
        });
        break;
      default:
        warn("no-route");
    }
  } else {
    const funcs = router[event];
    if (funcs) {
      info("custom-routing");
      // TODO: TypeScript type narrowing does not work here. See if we can find a workaround.
      funcs.forEach((func: any) => func(data));
      return;
    }
  }
}
