import { TestBoxMessage } from ".";
import { MessageSender } from "./types";

export const NAVIGATE_REQUEST_EVENT = "navigate-request";
export const INITIALIZE = "initialize";
export const LOGIN_REQUEST = "login-request";

export const VALID_INCOMING_EVENTS = [
  NAVIGATE_REQUEST_EVENT,
  INITIALIZE,
  LOGIN_REQUEST,
];

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
  typeof NAVIGATE_REQUEST_EVENT,
  NavigateRequestEvent
>;

export type LoginRequestEvent = {
  username?: string;
  password?: string;
  totpCode?: string;
};

export type LoginRequestMessage = TestBoxMessage<
  typeof LOGIN_REQUEST,
  LoginRequestEvent
>;

export type UnionedIncomingMessages =
  | InitializeRequestMessage
  | NavigateRequestMessage
  | LoginRequestMessage;

export type IncomingEventMap = {
  [INITIALIZE]: InitializeRequestEvent;
  [NAVIGATE_REQUEST_EVENT]: NavigateRequestEvent;
  [LOGIN_REQUEST]: LoginRequestEvent;
};
