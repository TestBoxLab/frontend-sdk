import { initializeTestBox } from "./initialize";
import {
  IncomingEventMap,
  INITIALIZE,
  NAVIGATE_REQUEST_EVENT,
  UnionedIncomingMessages,
} from "./messaging/incoming";
import { info, warn } from "./utils/logging";

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
  const funcs = router[event];
  if (funcs) {
    info("custom-routing");
    // TODO: TypeScript type narrowing does not work here. See if we can find a workaround.
    funcs.forEach((func: any) => func(data));
    return;
  }
  switch (testbox.event) {
    case INITIALIZE:
      initializeTestBox(testbox.data);
      break;
    case NAVIGATE_REQUEST_EVENT:
      window.location.href = testbox.data;
      break;
    default:
      warn("no-route");
  }
}
