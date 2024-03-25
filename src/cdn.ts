import { registerLoginHandler, startTestBox } from ".";

const params = new URLSearchParams(window.location.search);
const testcase = params.get("testcase");

async function fakeLoginHandler(props) {
  console.log("PROPS", props);
  return true;
}

switch (testcase) {
  case "delayed-login-handler-register":
    startTestBox(window.__tbxConfig || { allowFullStory: true });
    setTimeout(() => registerLoginHandler(fakeLoginHandler), 3000);
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
    });
    postMessage({
      testbox: {
        version: 1,
        sender: "app",
        event: "login",
        data: {
          email: "testuser2@tbxofficial.com",
          password: "password",
          first_name: "Test",
          last_name: "User 2",
        },
      },
    });
    break;
  case "login-handler-registered-before-login-message":
    startTestBox(window.__tbxConfig || { allowFullStory: true });
    registerLoginHandler(fakeLoginHandler);
    setTimeout(() => {
      postMessage({
        testbox: {
          version: 1,
          sender: "app",
          event: "login",
          data: {
            email: "testuser10@tbxofficial.com",
            password: "password",
            first_name: "Test",
            last_name: "User 10",
          },
        },
      });
    }, 3000);
    break;
  default:
    startTestBox(
      window.__tbxConfig || {
        allowFullStory: true,
        loginHandler: fakeLoginHandler,
      }
    );
    postMessage({
      testbox: {
        version: 1,
        sender: "app",
        event: "login",
        data: {
          email: "testuser1000@tbxofficial.com",
          password: "password",
          first_name: "Test",
          last_name: "User 1000",
        },
      },
    });
}
