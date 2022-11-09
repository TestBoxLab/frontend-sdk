import { getTargetOrigin } from "../config";
import {
  TestBoxIncomingEvents,
  UnionedIncomingEvents,
  VALID_INCOMING_EVENTS,
} from "./incoming";
import { TestBoxOutgoingEvents } from "./outgoing";
import { MessageSender, TestBoxMessage } from "./types";

export function sendMessageToTestBox<K extends keyof TestBoxOutgoingEvents>(
  event: K,
  data?: TestBoxOutgoingEvents[K]
) {
  window.postMessage(makeTestBoxEvent(event, data), getTargetOrigin());
}

export function makeTestBoxEvent<K extends keyof TestBoxOutgoingEvents>(
  event: K,
  data?: TestBoxOutgoingEvents[K]
): TestBoxMessage<K, TestBoxOutgoingEvents[K]> {
  return {
    testbox: {
      version: 1,
      sender: MessageSender.PARTNER,
      event,
      data,
    },
  };
}

export function isValidIncomingTestBoxMessage<
  K extends keyof TestBoxIncomingEvents
>(
  obj: unknown,
  dataGuard?: (x: unknown) => x is TestBoxIncomingEvents[K]
): obj is UnionedIncomingEvents {
  if (
    typeof obj === "object" &&
    obj !== null &&
    "testbox" in obj &&
    typeof obj["testbox"] === "object"
  ) {
    const { testbox: message } = obj as TestBoxMessage<
      K,
      TestBoxIncomingEvents[K]
    >;

    // Make sure this is a valid version and event
    if (
      message.version === 1 &&
      VALID_INCOMING_EVENTS.includes(message.event) &&
      message.sender === MessageSender.APP
    ) {
      if (dataGuard) {
        return dataGuard(message.data);
      }
      return true;
    }
  }
  return false;
}

export { TestBoxMessage };
