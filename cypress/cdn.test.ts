import { registerLoginHandler, startTestBox } from "../src";

declare global {
  interface Window {
    test_fakeLoginHandler: any;
    test_startTestBox: any;
    test_registerLoginHandler: any;
    test_baseTbxConfig: {
      targetOrigin: string;
      allowFullStory: boolean;
    }
  }
}

async function fakeLoginHandler(props) {
  console.log("Fake login handler called with", props);
  return true;
}

window.test_fakeLoginHandler = fakeLoginHandler;
window.test_startTestBox = startTestBox
window.test_registerLoginHandler = registerLoginHandler
window.test_baseTbxConfig = {
  targetOrigin: "localhost",
  allowFullStory: true
}