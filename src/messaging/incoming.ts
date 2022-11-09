import { MessageSender } from "./types";

export const NAVIGATE_REQUEST_EVENT = "navigate-request";
export const INITIALIZE = "initialize";

export const VALID_INCOMING_EVENTS = [NAVIGATE_REQUEST_EVENT, INITIALIZE];

export type InitializeRequestEvent = {
  optInFullStory: boolean;
};

export interface TestBoxIncomingEvents {
  [NAVIGATE_REQUEST_EVENT]: string;
  [INITIALIZE]: InitializeRequestEvent;
}

export type InitializeRequestMessage = {
  testbox: {
    version: 1;
    sender: MessageSender;
    event: typeof INITIALIZE;
    data: InitializeRequestEvent;
  };
};

export type NavigateRequestMessage = {
  testbox: {
    version: 1;
    sender: MessageSender;
    event: typeof NAVIGATE_REQUEST_EVENT;
    data: string;
  };
};

export type UnionedIncomingEvents =
  | InitializeRequestMessage
  | NavigateRequestMessage;
