import { initializeTestBox } from "./initialize";
import {
  INITIALIZE,
  NAVIGATE_REQUEST_EVENT,
  UnionedIncomingEvents,
} from "./messaging/incoming";
import { warn } from "./utils/logging";

// Note to future selves: you cannot destructure testbox here, the
// type narrowing does not work correctly if you do so here.
export function routeMessage({ testbox }: UnionedIncomingEvents) {
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
