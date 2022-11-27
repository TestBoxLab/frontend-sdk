import { sendMessageToTestBox } from "../messaging";
import { LOGIN_FAIL, LOGIN_SUCCESS } from "../messaging/outgoing";

export async function autoLogin(data, router) {
  let nextUrl;
  try {
    const funcs = router["login"];
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

  if (nextUrl === false) {
    sendMessageToTestBox(LOGIN_FAIL);
  } else {
    sendMessageToTestBox(LOGIN_SUCCESS);
  }
  return nextUrl;
}
