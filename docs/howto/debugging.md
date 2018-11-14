# Debugging

When developing, you often want to examine the state of the app, capture
events or print debugging messages. [React Native gives you several ways to
debug your app][react-debugging].

## Tools and setup

### Chrome Developer Tools / "Debug JS remotely"

React Native supports debugging the app using Chrome's developer tools, in
much the same way you would a web app.  This provides you with prettily
formatted debug messages and helpful additional information.

To use it, start the app.  (Either in the emulator, or see
[here][chrome-devtools-device] for additional instructions to do this on a
physical device.)  Then, [open the Developer Menu][dev-menu].  Here, select
"Debug JS Remotely".  This will open a new tab in your browser, at
http://localhost:8081/debugger-ui .  Go to this tab and open the developer
console.

This console will show all console debug output from your app, which means
that you can debug the app with statements like
```js
console.debug(foobar)
```

Additionally, all Redux events are automatically logged to the console.
See discussion of `redux-logger` below.

See also the "Troubleshooting" section below.

[chrome-devtools-device]: https://facebook.github.io/react-native/docs/debugging.html#debugging-on-a-device-with-chrome-developer-tools


### redux-logger: deeper info on Redux events

One extremely useful kind of information for debugging many kinds of issues
-- as well as for getting to understand how the app works! -- is to see the
Redux state, and a log of the Redux actions.

We have exactly that information logged to the console (in the Chrome
Developer Tools; see above), thanks to the middleware
[`redux-logger`](https://github.com/evgenyrodionov/redux-logger).

By default, it logs the previous state and next state of every action that
is dispatched.  You can control its behavior in more detail by editing the
call to `createLogger` in `src/boot/middleware.js`.

* `diff: true` will compute the diff (using
  [`deep-diff`](https://github.com/flitbit/diff#simple-examples)) between the
  old and new states.  For example, the log output for the action
  `SWITCH_NARROW` can look like this:

  ![image](https://user-images.githubusercontent.com/12771126/42355493-3a24885e-8082-11e8-96d9-fc7c59e0d1d0.png)

  This can be especially helpful for seeing what each action really does.

* `predicate` can be used to filter which actions cause a log message.  By
  default, all actions are logged; when looking at a long log, this option
  can help you cut noise and focus on actions relevant to what you're
  studying.

* Many other options exist!  See [the
  doc](https://github.com/evgenyrodionov/redux-logger#options).


### Reactotron

We have integrated [Reactotron](https://github.com/infinitered/reactotron) with the project.

It can be used instead of together with the 'Chrome Developer Tools'.
Some areas in which Reactotron is better are:

* track Async Storage updates
* show API requests & responses
* subscribe to parts of your application state
* dispatch custom Redux actions

Note: Make sure to enable the "Debug JS Remotely" option from inside of your app.

Refer to the [docs](https://github.com/infinitered/reactotron/blob/master/readme.md) for further details.

### `adb logcat`

When running on Android, either in the emulator or on a physical device, you
can use ADB (the Android debugger) to fetch or watch the device's logs.
This will include any messages that you print with a statement like
```js
console.debug(foobar)
```

To see the logs, run `adb logcat`.  A helpful form for this command is
```
adb logcat -T 100 | grep ReactNativeJS
```
This filters out logs unrelated to the app, but includes anything you print
with `console.debug`.  It starts with the last 100 log lines from before you
run the command (so it can be helpful for seeing something that just
happened), and then it keeps running, printing any new log messages that
come through.  To quit, hit Ctrl-C.


## Debugging message rendering and interactions

We render the message list using a native WebView component. Anything
related to the rendering of messages, the behavior of the message list, or
bugs inside it, you can debug with familiar tools.

Debugging is available both for Android and iOS, and on an emulator or
a physical device via a browser's developer tools.

### Debug WebView on iOS

1. Enable debugging on the device

To debug on your physical iOS device, go to `Settings > Safari > Advanced`
and make sure `Web Inspector` is on.

For iOS Simulator you can skip this step, as it is already enabled.

2. Connect to the device

* Run Safari (even if your browser of choice is something else).
* If you have not done so already, enable the developer tools by going to
 Safari’s menu, `Preferences > Advanced`, check the `Show Develop menu in the menu bar` checkbox.
* In the app you are debugging, make sure you have navigated to a screen that
 is showing a message list
* In the `Develop` menu, find your device and select it.

3. Debug

You now have access to the rich developer tools you might be familiar with.
You can inspect HTML elements, CSS styles and examine console.log output.

### Debug WebView on Android

1. Enable debugging on the device

To debug on your physical Android device, go to `Settings > About phone`.
Next, tap the `Build number` panel seven times. You will get a notice that
now you are a developer. Go back to the main Settings screen. Go to the new 
`Developer` options menu and enable the `USB debugging` checkbox.

For Android Emulator you can skip this step, as it is already enabled.

2. Connect to the device

* Run Chrome.
* Navigate to `about:inspect`.
* Check the `Discover USB devices` and the app will appear.

3. Debug

You now have access to the rich developer tools you might be familiar with.
You can inspect HTML elements, CSS styles and examine console.log output.

## Troubleshooting

### "Debug JS remotely" opens a webpage that never loads.

For some reason, React Native may try to open a browser tab for you at
http://10.0.2.2:8081/debugger-ui .
Instead, it should be http://localhost:8081/debugger-ui .

To fix this, simply open http://localhost:8081/debugger-ui in your browser.
This should load the web debugger you expected. Also, if the app was showing
a blank screen before, it should now behave normally.

If you're still experiencing this issue, [open the Developer menu in your app][dev-menu].
Then, go to "Debug server host & port for device". Here, enter `localhost:8081`
and click OK. Now, try to open http://localhost:8081/debugger-ui again and see
if it works.

[dev-menu]: https://facebook.github.io/react-native/docs/debugging.html#accessing-the-in-app-developer-menu
[react-debugging]: https://facebook.github.io/react-native/docs/debugging.html
