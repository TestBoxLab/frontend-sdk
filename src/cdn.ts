import { registerLoginHandler, startTestBox } from ".";

declare global {
  interface Window {
    fakeLoginHandler: any;
    startTestBox: any;
    registerLoginHandler: any;
    baseTbxConfig: {
      targetOrigin: string;
      allowFullStory: boolean;
    }
  }
}

async function fakeLoginHandler(props) {
  console.log("Fake login handler called with", props);
  return true;
}

window.fakeLoginHandler = fakeLoginHandler;
window.startTestBox = startTestBox
window.registerLoginHandler = registerLoginHandler
window.baseTbxConfig = {
  targetOrigin: "localhost",
  allowFullStory: true
}