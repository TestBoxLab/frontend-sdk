import { sendMessageToTestBox } from "../messaging";
import { LOGIN_ACK, LOGIN_FAIL, LOGIN_SUCCESS } from "../messaging/outgoing";

export let loggingIn = false;
export async function autoLogin(data, router) {
  loggingIn = true;
  sendMessageToTestBox(LOGIN_ACK);
  let nextUrl;
  try {
    const funcs = router["login-request"];
    if (!funcs) {
      console.log("No login callback exists!");
      sendMessageToTestBox(LOGIN_FAIL);
      return;
    }
    nextUrl = await funcs[0](data);
  } catch (e) {
    console.log(e);
    nextUrl = false;
  }
  loggingIn = false;

  if (nextUrl === false) {
    sendMessageToTestBox(LOGIN_FAIL);
  } else {
    sendMessageToTestBox(LOGIN_SUCCESS);
  }
  return nextUrl;
}
