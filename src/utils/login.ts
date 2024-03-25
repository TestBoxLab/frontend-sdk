import { sendMessageToTestBox } from "../messaging";
import { LOGIN_FAIL, LOGIN_SUCCESS } from "../messaging/outgoing";
import { IncomingEventHandlers, LoginEvent } from "../messaging/incoming";
import { error } from "./logging";
import { MessageSender } from "../messaging/types";

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
      window.__loginMessagesQueue.push(
        { 
          testbox: { 
            event: "login",
            data,
            version: 1,
            sender: MessageSender.APP
          }
        }
      )
      return
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
