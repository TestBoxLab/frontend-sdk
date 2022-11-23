import { TestBoxMessage } from ".";
import { MessageSender } from "./types";

export const NAVIGATE = "navigate";
export const INITIALIZE = "initialize";
export const LOGIN = "login";

export const VALID_INCOMING_EVENTS = [NAVIGATE, INITIALIZE, LOGIN];

// FYI, incoming events are typed slightly differently than outgoing
// events due to a this issue in TypeScript:
// https://github.com/microsoft/TypeScript/issues/33014

export type InitializeRequestEvent = {
  optInFullStory: boolean;
};

export type InitializeRequestMessage = TestBoxMessage<
  typeof INITIALIZE,
  InitializeRequestEvent
>;

export type NavigateRequestEvent = {
  url: string;
};

export type NavigateRequestMessage = TestBoxMessage<
  typeof NAVIGATE,
  NavigateRequestEvent
>;

export type LoginRequestEvent = {
  username?: string;
  password?: string;
  totpCode?: string;
};

export type LoginRequestMessage = TestBoxMessage<
  typeof LOGIN,
  LoginRequestEvent
>;

export type UnionedIncomingMessages =
  | InitializeRequestMessage
  | NavigateRequestMessage
  | LoginRequestMessage;

export type IncomingEventMap = {
  [INITIALIZE]: InitializeRequestEvent;
  [NAVIGATE]: NavigateRequestEvent;
  [LOGIN]: LoginRequestEvent;
};
