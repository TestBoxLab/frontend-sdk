import { registerLoginHandler, startTestBox } from "../src/index";

declare global {
  interface Window {
    test_fakeLoginHandler: (props: any) => Promise<string | boolean>;
    test_fakeNavigateHandler: (data: any) => void;
    test_startTestBox: any;
    test_registerLoginHandler: any;
    test_baseTbxConfig: {
      targetOrigin: string;
      allowFullStory: boolean;
    };
  }
}

async function fakeLoginHandler(props: any): Promise<string | boolean> {
  console.log("Fake login handler called with", props);
  return true;
}

async function fakeNavigateHandler(data: any): Promise<void | boolean> {
  console.log("Fake navigate handler called with", data);
  return true;
}

window.test_fakeLoginHandler = fakeLoginHandler;
window.test_fakeNavigateHandler = fakeNavigateHandler;
window.test_startTestBox = startTestBox;
window.test_registerLoginHandler = registerLoginHandler;
window.test_baseTbxConfig = {
  targetOrigin: "localhost",
  allowFullStory: true,
};

// tbxConfig
const config = {
  navigateHandler: window.test_fakeNavigateHandler,
  loginHandler: window.test_fakeLoginHandler,
  logLevel: "error",
  ...window.test_baseTbxConfig,
};

// @ts-ignore
// startTestBox(config);
