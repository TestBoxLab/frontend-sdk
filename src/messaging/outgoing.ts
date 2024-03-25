export const HEALTH_CHECK = "health-check";
export const CLICK = "click";
export const EXIT_FULLSCREEN = "exit-fullscreen";

export const INITIALIZE_REQUEST = "initialize-request";
export const RESET_IFRAME_REQUEST = "reset-iframe-request";

export const INITIALIZE_ACK = "initialize-ack";
export const INITIALIZE_SUCCESS = "initialize-success";
export const INITIALIZE_FAIL = "initialize-fail";

export const LOGIN_ACK = "login-ack";
export const LOGIN_SUCCESS = "login-success";
export const LOGIN_FAIL = "login-fail";
export const LOGIN_NO_CREDS = "login-no-creds";

export const NAVIGATE_ACK = "navigate-ack";

type HealthCheckEvent = {
  url: string;
};

type ClickEvent = {
  x: number;
  y: number;
  target?: string;
};

type LoginFailEvent = {
  message?: string;
};

export interface TestBoxOutgoingEvents {
  [INITIALIZE_REQUEST]: undefined;
  [RESET_IFRAME_REQUEST]: undefined;
  [HEALTH_CHECK]: HealthCheckEvent;
  [CLICK]: ClickEvent;
  [INITIALIZE_ACK]: undefined;
  [INITIALIZE_SUCCESS]: undefined;
  [INITIALIZE_FAIL]: undefined;
  [LOGIN_ACK]: undefined;
  [LOGIN_SUCCESS]: undefined;
  [LOGIN_FAIL]: LoginFailEvent;
  [LOGIN_NO_CREDS]: undefined;
  [NAVIGATE_ACK]: undefined;
  [EXIT_FULLSCREEN]: undefined;
}
