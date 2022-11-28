<img src="docs/pedals.svg" width="125">

# TestBox Browser SDK

[![Test, build, publish](https://github.com/TestBoxLab/browser-sdk/actions/workflows/build.yml/badge.svg)](https://github.com/TestBoxLab/browser-sdk/actions/workflows/build.yml)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-%23FE5196?logo=conventionalcommits&logoColor=white)](https://conventionalcommits.org)

## Installation

First, install the package in to your front-end.

`npm i @testboxlab/browser`

`yarn add @testboxlab/browser`

## Usage and Purpose

This package provides two sets of functionality:

* Communication to TestBox for user experience purposes
* [Client-side Auto-login][1]

### Base Usage

If you just need the basics of TestBox for your app, you'll use something like this:

```javascript
import { startTestBox } from "@testboxlab/browser";

startTestBox({
    allowFullStory: true,
    // Allowing FullStory allows us to give you insights into how users
    // are using your web application compared to others. However, it is
    // explicitly opt-in in case you do not wish for your environments
    // to be recorded.
});
```

This will allow TestBox to communicate with your web site. This communication is
important to remove loading states and generally provide a good user experience.

If you use React, your implementation might look like this:

```javascript
import { startTestBox } from "@testboxlab/browser";
import { useEffect } from "react";

export default function App() {
    useEffect(() => {
        startTestBox();
    }, []);
}
```

### Navigation

If you use react-router, or any kind of client-side routing, you may want to override
our standard navigation behavior. Navigation happens when a user chooses a use case
they want to try out. By default, TestBox will use `window.location` to push the iFrame
to a new URL. You might want to do something more sophisticated.

There are two ways to interact with the browser SDK for events:

```javascript
// Option 1: you can use the config object
startTestBox({
    navigateHandler: (url) => {
        history.push(url);
    }
});

// Option 2: you can set the handler directly
import testbox from "@testboxlab/browser-sdk";

testbox.navigateHandler = (url) => {
    history.push(url);
};
```

### Auto-login

If you have opted to use our client-side auto-login functionality, you have a bit
more work to do.

On your login page/component, you will want to add some code similar to the following:

```javascript
import { autoLoginCallback } from "@testboxlab/browser";

autoLoginCallback((email, password) => {
    // Use the email and password to log in, either by filling out
    // your "login" form and submitting, or some other mechanism.

    // After logging in, make sure to redirect the user.
    window.location = "/";
});
```

## Testing

### Testing your installation

If you'd like to verify that you have installed the script correctly, you can use
our [self-check tool][2] which can verify that everything is working!

### Package testing

[1]: https://partner-docs.testbox.com/docs/autologin/javascript/
[2]: https://partner-docs.testbox.com/docs/iframing/test/