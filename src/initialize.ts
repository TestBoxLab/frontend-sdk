import { sendMessageToTestBox } from "./messaging";
import { addFullStory } from "./fullstory";
import {
  CLICK,
  HEALTH_CHECK,
  INITIALIZE_ACK,
  INITIALIZE_FAIL,
  INITIALIZE_SUCCESS,
} from "./messaging/outgoing";
import { InitializeRequestEvent } from "./messaging/incoming";
import { getConfigItem } from "./config";

export function initializeTestBox(data: InitializeRequestEvent) {
  try {
    sendMessageToTestBox(INITIALIZE_ACK);
    initializeCookies();
    rewriteLinks();
    startHealthChecks();

    if (data.optInFullStory && getConfigItem("allowFullStory")) {
      addFullStory();
    }

    sendMessageToTestBox(INITIALIZE_SUCCESS);
  } catch {
    sendMessageToTestBox(INITIALIZE_FAIL);
  }
}

function initializeCookies() {
  // Moar cookie hacks. In order to make Cloudflare cookies work
  // inside the TestBox, we need to make sure they have samesite=none
  // since the top-level origin != the iframe origin
  const nativeCookieSetter = (document as any).__lookupSetter__("cookie");
  // const nativeCookieGetter = (document as any).__lookupGetter__("cookie");

  function setCookieOverride(value: string) {
    if (value.toLowerCase().includes("samesite")) {
      // TODO: probably need to do a regex replacement here.
    } else {
      value += ";samesite=none;secure";
    }
    // @ts-ignore
    return nativeCookieSetter.call(document, value);
  }
  (document as any).__defineSetter__("cookie", setCookieOverride);
  // (document as any).__defineGetter__("cookie", nativeCookieGetter);
}

function rewriteLinks() {
  // remove all target = "_blank" props to keep pages inside the iframe ...
  const rewriteTargets = () => {
    var links = document.querySelectorAll("a[target]");
    for (var i = 0; i < links.length; i++) {
      links[i].removeAttribute("target");
    }
  };

  // watch for clicks to fix hrefs ...
  window.addEventListener(
    "click",
    (event) => {
      rewriteTargets();
      sendMessageToTestBox(CLICK, {
        x: event.x,
        y: event.y,
        target: event.target,
      });
    },
    false
  );

  const rewriteLoop = () => {
    rewriteTargets();
    setTimeout(() => {
      rewriteLoop();
    }, getConfigItem("linkTargetLoopInterval", 5000));
  };

  rewriteLoop();
}

function startHealthChecks() {
  const healthCheck = () => {
    sendMessageToTestBox(HEALTH_CHECK, {
      url: window.location.href,
    });
  };

  const healthLoop = () => {
    healthCheck();
    setTimeout(() => healthLoop(), getConfigItem("healthCheckInterval", 1000));
  };

  healthLoop();
}
