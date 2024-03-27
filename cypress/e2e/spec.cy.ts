const BASE_URL = "http://localhost:8080";
const spyPostMessage = (win) => {
  cy.spy(win.parent, "postMessage").as("postMessage");
};
const spyLoginHandler = (win) => {
  cy.spy(win, "test_fakeLoginHandler").as("loginHandlerSpy");
};
const spyNavigateHandler = (win) => {
  cy.spy(win, "test_fakeNavigateHandler").as("navigateHandlerSpy")
}

const loginHandlerStub = (win, returnValue) => {
  cy.stub(win, "test_fakeLoginHandler").as("loginHandlerStub").callsFake(() => returnValue)
}

const assertInitializeCall = () =>
  cy.get("@postMessage").should(
    "have.been.calledOnceWith",
    {
      testbox: {
        version: 1,
        sender: "partner",
        event: "initialize-request",
        data: undefined,
      },
    },
    "*"
  );

const fakeLoginMessage = () => ({
  testbox: {
    version: 1,
    sender: "app",
    event: "login",
    data: {
      email: "testuser1@tbxofficial.com",
      password: "password",
      first_name: "Test",
      last_name: "User 1",
    },
  },
  }
)
const fakeLoginMessageStringified = JSON.stringify(fakeLoginMessage())

describe("testbox script", () => {
  it("Sends initialize to TestBox", () => {
    cy.visit(BASE_URL, {
      onBeforeLoad: spyPostMessage,
    });

    cy.window().then((win) => {
      win.eval(`test_startTestBox(window.test_baseTbxConfig);`);
    });

    assertInitializeCall();
  });

  it("Login handler registered on start", () => {
    cy.visit(BASE_URL, {
      onBeforeLoad: spyPostMessage,
      onLoad: spyLoginHandler,
    });

    cy.window().then((win) => {
      win.eval(
        `test_startTestBox({ ...window.test_baseTbxConfig, loginHandler: window.test_fakeLoginHandler });`
      );
    });

    assertInitializeCall();

    cy.window().then((win) => {
      win.eval(`postMessage(${fakeLoginMessageStringified})`);
    });

    cy.get("@loginHandlerSpy").should("have.been.calledOnceWith", fakeLoginMessage().testbox.data);
  });

  it("Login handler register after login message", () => {
    cy.visit(BASE_URL, {
      onBeforeLoad: spyPostMessage,
      onLoad: spyLoginHandler,
    });

    cy.window().then((win) => {
      win.eval(`test_startTestBox(window.test_baseTbxConfig);`);
    });

    assertInitializeCall();

    cy.window().then((win) => {
      win.eval(`
        postMessage(${fakeLoginMessageStringified});`);
      win.eval("window.test_registerLoginHandler(window.test_fakeLoginHandler);");
    });

    cy.get("@loginHandlerSpy").should("have.been.calledOnceWith", fakeLoginMessage().testbox.data);
  });

  it("Login handler register before login message", () => {
    cy.visit(BASE_URL, {
      onBeforeLoad: spyPostMessage,
      onLoad: spyLoginHandler,
    });

    cy.window().then((win) => {
      win.eval(`test_startTestBox(window.test_baseTbxConfig);`);
    });

    assertInitializeCall();

    cy.window().then((win) => {
      win.eval("window.test_registerLoginHandler(window.test_fakeLoginHandler);");
      win.eval(`
        postMessage(${fakeLoginMessageStringified});`);
    });

    cy.get("@loginHandlerSpy").should("have.been.calledOnceWith", fakeLoginMessage().testbox.data);
  });

  it("Login handler should return redirect url", () => {
    const fakeRedirectUrl = "https://fakeurl.com/success"
    cy.visit(BASE_URL, {
      onBeforeLoad: spyPostMessage,
      onLoad: (win) => {
        loginHandlerStub(win, fakeRedirectUrl)
        spyNavigateHandler(win)
      },
    });

    cy.window().then((win) => {
      win.eval(`test_startTestBox({...window.test_baseTbxConfig, window: window.parent, navigateHandler: window.test_fakeNavigateHandler });`);
    });

     cy.window().then((win) => {
      win.eval("window.test_registerLoginHandler(window.test_fakeLoginHandler);");
      win.eval(`
        postMessage(${fakeLoginMessageStringified});`);
    });

    cy.get("@loginHandlerStub").should("have.returned", fakeRedirectUrl);
    cy.get("@navigateHandlerSpy").should("have.been.calledWith", {url: fakeRedirectUrl});
  });

  it("LoginHandler should send login-failed message in case of error", () => {
    cy.visit(BASE_URL, {
      onBeforeLoad: spyPostMessage,
      onLoad: (win) => loginHandlerStub(win, false),
    });

    cy.window().then((win) => {
      win.eval(`test_startTestBox({...window.test_baseTbxConfig, window: window.parent });`);
    });

     cy.window().then((win) => {
      win.eval("window.test_registerLoginHandler(window.test_fakeLoginHandler);");
      win.eval(`
        postMessage(${fakeLoginMessageStringified});`);
    });

    cy.get("@loginHandlerStub").should("have.returned", false);

    cy.get("@postMessage").should("have.been.calledWith", {
     testbox: {
       version: 1,
       event: "login-fail",
       data: { message: undefined },
       sender: "partner"
      }
    })
  });

  it("LoginHandler should send login-success message in case of success", () => {
    cy.visit(BASE_URL, {
      onBeforeLoad: spyPostMessage,
      onLoad: spyLoginHandler,
    });

    cy.window().then((win) => {
      win.eval(`test_startTestBox(window.test_baseTbxConfig);`);
    });

    assertInitializeCall();

    cy.window().then((win) => {
      win.eval("window.test_registerLoginHandler(window.test_fakeLoginHandler);");
      win.eval(`
        postMessage(${fakeLoginMessageStringified});`);
    });

    cy.wrap(win => {
      cy.get("@loginHandlerSpy").should("have.been.calledWith", true)
    })
    cy.get("@postMessage").should("have.been.calledWith", {
     testbox: {
       version: 1,
       event: "login-success",
       data: undefined,
       sender: "partner"
      }
    })

  });

  it("registerLoginHandler should display warning if registered more than once", () => {
    cy.visit(BASE_URL, {
      onBeforeLoad: spyPostMessage,
      onLoad: (win) => {
        spyLoginHandler(win)
        cy.spy(win.console, 'warn').as("warnSpy")
      },
    });

    cy.window().then((win) => {
      win.eval(`test_startTestBox({...window.test_baseTbxConfig, logLevel: "warn"});`);
    });

    assertInitializeCall();

    cy.window().then((win) => {
      win.eval("window.test_registerLoginHandler(window.test_fakeLoginHandler);");
      win.eval("window.test_registerLoginHandler(window.test_fakeLoginHandler);");
    });

    cy.get("@warnSpy").should("have.been.calledOnceWith", JSON.stringify({"event":"Login handler already registered!"}))
  });

  it("Login event waiting for more than 10 seconds should send error message", () => {
     cy.visit(BASE_URL, {
       onBeforeLoad: spyPostMessage,
       onLoad: spyLoginHandler,
     });

     cy.window().then((win) => {
       win.eval(`test_startTestBox({...window.test_baseTbxConfig, window: window.parent });`);
     });

     cy.window().then((win) => {
       win.eval(`
         postMessage(${fakeLoginMessageStringified});`);
     })

     cy.wait(10500)

     cy.get("@postMessage").should("have.been.calledWith", {
       testbox: {
         version: 1,
         event: "login-fail",
         data: { message: "Failed to log in." },
         sender: "partner"
       }
     })
   })
});
