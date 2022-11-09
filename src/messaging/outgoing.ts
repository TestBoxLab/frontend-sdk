export const INITIALIZE_REQUEST_EVENT = "initialize-request";
export const HEALTH_CHECK = "health-check";
export const CLICK = "click";
export const INITIALIZE_ACK = "initialize-ack";
export const INITIALIZE_SUCCESS = "initialize-success";
export const INITIALIZE_FAIL = "initialize-fail";

type HealthCheckEvent = {
  url: string;
};

type ClickEvent = {
  x: number;
  y: number;
  target: any;
};

export interface TestBoxOutgoingEvents {
  [INITIALIZE_REQUEST_EVENT]: undefined;
  [HEALTH_CHECK]: HealthCheckEvent;
  [CLICK]: ClickEvent;
  [INITIALIZE_ACK]: undefined;
  [INITIALIZE_SUCCESS]: undefined;
  [INITIALIZE_FAIL]: undefined;
}
