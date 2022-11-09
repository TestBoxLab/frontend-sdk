import { initializeTestBox } from "./initialize";
import {
  INITIALIZE,
  NAVIGATE_REQUEST_EVENT,
  UnionedIncomingEvents,
} from "./messaging/incoming";
import { warn } from "./utils/logging";

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
