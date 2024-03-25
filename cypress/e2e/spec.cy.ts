const BASE_URL = "http://localhost:8080";
const spyPostMessage = (win) => {
  cy.spy(win.parent, "postMessage").as("postMessage");
};
const spyLoginHandler = (win) => {
  cy.spy(win, "test_fakeLoginHandler").as("loginHandler");
};
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

    cy.get("@loginHandler").should("have.been.calledOnceWith", fakeLoginMessage().testbox.data);
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

    cy.get("@loginHandler").should("have.been.calledOnceWith", fakeLoginMessage().testbox.data);
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

    cy.get("@loginHandler").should("have.been.calledOnceWith", fakeLoginMessage().testbox.data);
  });

  it("Login event waiting for more than 10 seconds", () => {
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
    });
  });
});
