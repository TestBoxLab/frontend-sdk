import { sendMessageToTestBox } from "../messaging";
import { LOGIN_FAIL, LOGIN_SUCCESS } from "../messaging/outgoing";
import { TestBoxEventRouter } from "../router";
import { LoginEvent } from "../messaging/incoming";

export let loggingIn = false;

export async function autoLogin(
  data: LoginEvent,
  router: TestBoxEventRouter
) {
  let nextUrl: string | boolean;
  loggingIn = true;
  try {
    const funcs = router["login"];
    if (!funcs) {
      console.log("No login callback exists!");
      sendMessageToTestBox(LOGIN_FAIL);
      return;
    }
    nextUrl = await Promise.any(funcs.map((func) => func(data)));
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
