import { TestBoxMessage } from ".";
import { MessageSender } from "./types";

export const NAVIGATE = "navigate";
export const INITIALIZE = "initialize";
export const LOGIN = "login";

export const VALID_INCOMING_EVENTS = [NAVIGATE, INITIALIZE, LOGIN];

// FYI, incoming events are typed slightly differently than outgoing
// events due to a this issue in TypeScript:
// https://github.com/microsoft/TypeScript/issues/33014

export type InitializeEvent = {
  optInFullStory: boolean;
};

export type InitializeMessage = TestBoxMessage<
  typeof INITIALIZE,
  InitializeEvent
>;

export type NavigateEvent = {
  url: string;
};

export type NavigateMessage = TestBoxMessage<typeof NAVIGATE, NavigateEvent>;

export type LoginEvent = {
  username?: string;
  password?: string;
  totpCode?: string;
};

export type LoginMessage = TestBoxMessage<typeof LOGIN, LoginEvent>;

export type UnionedIncomingMessages =
  | InitializeMessage
  | NavigateMessage
  | LoginMessage;

export type IncomingEventMap = {
  [INITIALIZE]: InitializeEvent;
  [NAVIGATE]: NavigateEvent;
  [LOGIN]: LoginEvent;
};

export type IncomingEventHandlers = {
  [INITIALIZE]: (data: InitializeEvent) => void;
  [NAVIGATE]: (data: NavigateEvent) => void;
  [LOGIN]: (data: LoginEvent) => Promise<string | boolean>;
};
