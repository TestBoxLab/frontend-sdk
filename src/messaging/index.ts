import { getConfigItem } from "../config";
import { UnionedIncomingMessages, VALID_INCOMING_EVENTS } from "./incoming";
import { TestBoxOutgoingEvents } from "./outgoing";
import { MessageSender, TestBoxMessage } from "./types";

export function sendMessageToTestBox<K extends keyof TestBoxOutgoingEvents>(
  event: K,
  data?: TestBoxOutgoingEvents[K]
) {
  const targetWindow = getConfigItem("window", window.parent);
  targetWindow?.postMessage(makeTestBoxEvent(event, data), "*");
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
      data: data || ({} as TestBoxOutgoingEvents[K]),
    },
  };
}

export function isValidIncomingTestBoxMessage<
  T extends UnionedIncomingMessages
>(
  obj: unknown,
  dataGuard?: (x: unknown) => x is T["testbox"]["data"]
): obj is T {
  try {
    const { testbox: message } = obj as TestBoxMessage<
      T["testbox"]["event"],
      T["testbox"]["data"]
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
  } catch (e) {}
  return false;
}

export { TestBoxMessage };
