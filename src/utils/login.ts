import { sendMessageToTestBox } from "../messaging";
import { LOGIN_FAIL, LOGIN_SUCCESS } from "../messaging/outgoing";
import { IncomingEventHandlers, LoginEvent } from "../messaging/incoming";

export let loggingIn = false;

export async function autoLogin(
  data: LoginEvent,
  router: Partial<IncomingEventHandlers>
) {
  let nextUrl: string | boolean;
  loggingIn = true;
  try {
    const func = router["login"];
    if (!func) {
      console.log("No login callback exists!");
      sendMessageToTestBox(LOGIN_FAIL);
      return;
    }
    nextUrl = await func(data);
  } catch (e) {
    console.log(e);
    nextUrl = false;
  }

  if (nextUrl === false) {
    sendMessageToTestBox(LOGIN_FAIL);
  } else {
    sendMessageToTestBox(LOGIN_SUCCESS);
  }
  return nextUrl;
}
