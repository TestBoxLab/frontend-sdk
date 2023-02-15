import { sendMessageToTestBox } from "../messaging";
import { LOGIN_FAIL, LOGIN_SUCCESS } from "../messaging/outgoing";
import { IncomingEventHandlers, LoginEvent } from "../messaging/incoming";
import { error, info } from "./logging";

export let loggingIn = false;

export async function autoLogin(
  data: LoginEvent,
  router: Partial<IncomingEventHandlers>
) {
  let nextUrl: string | boolean;
  let errorMessage: string;
  loggingIn = true;
  try {
    const func = router["login"];
    if (!func) {
      info("No login callback exists!");
      sendMessageToTestBox(LOGIN_FAIL);
      return;
    }
    nextUrl = await func(data);
  } catch (e) {
    error(e);
    errorMessage = e.message;
    nextUrl = false;
  }

  if (nextUrl === false) {
    sendMessageToTestBox(LOGIN_FAIL, { message: errorMessage });
  } else {
    sendMessageToTestBox(LOGIN_SUCCESS);
  }
  return nextUrl;
}
