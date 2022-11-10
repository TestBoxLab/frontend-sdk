(() => {
  // src/config.ts
  function getTargetOrigin() {
    return window.__tbxConfig?.targetOrigin || "https://app.testbox.com";
  }
  function getLogLevel() {
    return window.__tbxConfig.logLevel || "none";
  }
  function getConfigItem(key, fallback) {
    return window.__tbxConfig[key] || fallback;
  }

  // src/utils/logging.ts
  function logLevel() {
    switch (getLogLevel()) {
      case "none":
        return 0 /* none */;
      case "debug":
        return 1 /* debug */;
      case "info":
        return 2 /* info */;
      case "warn":
        return 3 /* warn */;
      case "error":
        return 4 /* error */;
    }
    throw Error("No log level known");
  }
  function info(event, ...payload) {
    if (logLevel() >= 2 /* info */) {
      console.info(JSON.stringify({ event, ...payload }));
    }
  }
  function warn(event, ...payload) {
    if (logLevel() >= 3 /* warn */) {
      console.warn(JSON.stringify({ event, ...payload }));
    }
  }

  // src/messaging/incoming.ts
  var NAVIGATE_REQUEST_EVENT = "navigate-request";
  var INITIALIZE = "initialize";
  var VALID_INCOMING_EVENTS = [NAVIGATE_REQUEST_EVENT, INITIALIZE];

  // src/messaging/index.ts
  function sendMessageToTestBox(event, data) {
    window.postMessage(makeTestBoxEvent(event, data), getTargetOrigin());
  }
  function makeTestBoxEvent(event, data) {
    return {
      testbox: {
        version: 1,
        sender: "partner" /* PARTNER */,
        event,
        data
      }
    };
  }
  function isValidIncomingTestBoxMessage(obj, dataGuard) {
    if (typeof obj === "object" && obj !== null && "testbox" in obj && typeof obj["testbox"] === "object") {
      const { testbox: message } = obj;
      if (message.version === 1 && VALID_INCOMING_EVENTS.includes(message.event) && message.sender === "app" /* APP */) {
        if (dataGuard) {
          return dataGuard(message.data);
        }
        return true;
      }
    }
    return false;
  }

  // src/fullstory/index.js
  function addFullStory() {
    info("added-fullstory");
    window["_fs_debug"] = false;
    window["_fs_host"] = "fullstory.com";
    window["_fs_script"] = "window-top.testboxlab.workers.dev/edge.fullstory.com/s/fs.js";
    window["_fs_org"] = "159FR5";
    window["_fs_namespace"] = "tbxFS";
    window["_fs_run_in_iframe"] = true;
    (function(m, n, e, t, l, o, g, y) {
      if (e in m) {
        if (m.console && m.console.log) {
          m.console.log(
            'FullStory namespace conflict. Please set window["_fs_namespace"].'
          );
        }
        return;
      }
      g = m[e] = function(a, b, s) {
        g.q ? g.q.push([a, b, s]) : g._api(a, b, s);
      };
      g.q = [];
      o = n.createElement(t);
      o.async = 1;
      o.crossOrigin = "anonymous";
      o.src = "https://" + _fs_script;
      y = n.getElementsByTagName(t)[0];
      y.parentNode.insertBefore(o, y);
      g.identify = function(i, v, s) {
        g(l, { uid: i }, s);
        if (v)
          g(l, v, s);
      };
      g.setUserVars = function(v, s) {
        g(l, v, s);
      };
      g.event = function(i, v, s) {
        g("event", { n: i, p: v }, s);
      };
      g.anonymize = function() {
        g.identify(false);
      };
      g.shutdown = function() {
        g("rec", false);
      };
      g.restart = function() {
        g("rec", true);
      };
      g.log = function(a, b) {
        g("log", [a, b]);
      };
      g.consent = function(a) {
        g("consent", !arguments.length || a);
      };
      g.identifyAccount = function(i, v) {
        o = "account";
        v = v || {};
        v.acctId = i;
        g(o, v);
      };
      g.clearUserCookie = function() {
      };
      g.setVars = function(n2, p) {
        g("setVars", [n2, p]);
      };
      g._w = {};
      y = "XMLHttpRequest";
      g._w[y] = m[y];
      y = "fetch";
      g._w[y] = m[y];
      if (m[y])
        m[y] = function() {
          return g._w[y].apply(this, arguments);
        };
      g._v = "1.3.0";
    })(window, document, window["_fs_namespace"], "script", "user");
  }

  // src/messaging/outgoing.ts
  var INITIALIZE_REQUEST_EVENT = "initialize-request";
  var HEALTH_CHECK = "health-check";
  var CLICK = "click";
  var INITIALIZE_ACK = "initialize-ack";
  var INITIALIZE_SUCCESS = "initialize-success";
  var INITIALIZE_FAIL = "initialize-fail";

  // src/initialize.ts
  function initializeTestBox(data) {
    try {
      sendMessageToTestBox(INITIALIZE_ACK);
      initializeCookies();
      rewriteLinks();
      startHealthChecks();
      if (data.optInFullStory) {
        addFullStory();
      }
      sendMessageToTestBox(INITIALIZE_SUCCESS);
    } catch {
      sendMessageToTestBox(INITIALIZE_FAIL);
    }
  }
  function initializeCookies() {
    const nativeCookieSetter = document.__lookupSetter__("cookie");
    function setCookieOverride(value) {
      if (value.toLowerCase().includes("samesite")) {
      } else {
        value += ";samesite=none;secure";
      }
      return nativeCookieSetter.call(document, value);
    }
    document.__defineSetter__("cookie", setCookieOverride);
  }
  function rewriteLinks() {
    const rewriteTargets = () => {
      var links = document.querySelectorAll("a[target]");
      for (var i = 0; i < links.length; i++) {
        links[i].removeAttribute("target");
      }
    };
    window.addEventListener(
      "click",
      (event) => {
        rewriteTargets();
        sendMessageToTestBox(CLICK, {
          x: event.x,
          y: event.y,
          target: event.target
        });
      },
      false
    );
    const rewriteLoop = () => {
      rewriteTargets();
      setTimeout(() => {
        rewriteLoop();
      }, getConfigItem("linkTargetLoopInterval", 5e3));
    };
    rewriteLoop();
  }
  function startHealthChecks() {
    const healthCheck = () => {
      sendMessageToTestBox(HEALTH_CHECK, {
        url: window.location.href
      });
    };
    const healthLoop = () => {
      healthCheck();
      setTimeout(() => healthCheck(), getConfigItem("healthCheckInterval", 1e3));
    };
    healthLoop();
  }

  // src/router.ts
  function routeMessage({ testbox }) {
    switch (testbox.event) {
      case INITIALIZE:
        initializeTestBox(testbox.data);
        break;
      case NAVIGATE_REQUEST_EVENT:
        window.location.href = testbox.data;
        break;
      default:
        warn("no-route");
    }
  }

  // src/index.ts
  window.addEventListener("message", (ev) => {
    if (ev.origin !== getTargetOrigin()) {
      info("target-mismatch", {
        messageOrigin: ev.origin,
        targetOrigin: getTargetOrigin()
      });
      return;
    }
    const { data } = ev;
    if (!isValidIncomingTestBoxMessage(data)) {
      info("not-a-testbox-message", { data });
      return;
    }
    routeMessage(data);
  });
  sendMessageToTestBox(INITIALIZE_REQUEST_EVENT);
})();
