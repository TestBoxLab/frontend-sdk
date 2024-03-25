const BASE_URL = "http://localhost:8080";
const spyPostMessage = (win) => {
  cy.spy(win.parent, "postMessage").as("postMessage");
};
const spyLoginHandler = (win) => {
  cy.spy(win, "fakeLoginHandler").as("loginHandler");
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

describe("testbox script", () => {
  it("Sends initialize to TestBox", () => {
    cy.visit(BASE_URL, {
      onBeforeLoad: spyPostMessage,
    });

    cy.window().then((win) => {
      win.eval(`startTestBox(window.baseTbxConfig);`);
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
        `startTestBox({ ...window.baseTbxConfig, loginHandler: window.fakeLoginHandler });`
      );
    });

    assertInitializeCall();

    cy.window().then((win) => {
      win.eval(`
        postMessage({
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
        });`);
    });

    cy.get("@loginHandler").should("have.been.calledOnceWith", {
      email: "testuser1@tbxofficial.com",
      password: "password",
      first_name: "Test",
      last_name: "User 1",
    });
  });

  it("Login handler register after login message", () => {
    cy.visit(BASE_URL, {
      onBeforeLoad: spyPostMessage,
      onLoad: spyLoginHandler,
    });

    cy.window().then((win) => {
      win.eval(`startTestBox(window.baseTbxConfig);`);
    });

    assertInitializeCall();

    cy.window().then((win) => {
      win.eval(`
        postMessage({
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
        });`);
      win.eval("window.registerLoginHandler(window.fakeLoginHandler);");
    });

    cy.get("@loginHandler").should("have.been.calledOnceWith", {
      email: "testuser1@tbxofficial.com",
      password: "password",
      first_name: "Test",
      last_name: "User 1",
    });
  });

  it("Login handler register before login message", () => {
    cy.visit(BASE_URL, {
      onBeforeLoad: spyPostMessage,
      onLoad: spyLoginHandler,
    });

    cy.window().then((win) => {
      win.eval(`startTestBox(window.baseTbxConfig);`);
    });

    assertInitializeCall();

    cy.window().then((win) => {
      win.eval("window.registerLoginHandler(window.fakeLoginHandler);");
      win.eval(`
        postMessage({
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
        });`);
    });

    cy.get("@loginHandler").should("have.been.calledOnceWith", {
      email: "testuser1@tbxofficial.com",
      password: "password",
      first_name: "Test",
      last_name: "User 1",
    });
  });
});
