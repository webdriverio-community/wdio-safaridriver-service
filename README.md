WDIO SafariDriver Service
================================

(Based entirely on [wdio-edgedriver-service](https://www.npmjs.com/package/wdio-edgedriver-service)... which itself was based entirely on [wdio-chromedriver-service](https://www.npmjs.com/package/wdio-chromedriver-service)... which was based on [selenium-standalone-service](https://www.npmjs.com/package/@wdio/selenium-standalone-service). I think thats it)

Note - this service is targeted at WDIO v5.

----

This service helps you to run the Safari browser seamlessly when running tests with the [WDIO testrunner](http://webdriver.io/guide/testrunner/gettingstarted.html). 
It uses the [/usr/bin/safaridriver](https://developer.apple.com/documentation/webkit/testing_with_webdriver_in_safari) that comes with Safari/OSX.

Note - this service does not require a Selenium server, but uses the `/usr/bin/safaridriver` to communicate with the browser directly.
Obvisously, it only supports:

```js
capabilities: [{
        browserName: 'safari'
    }]
```

## Installation

The easiest way is to keep `wdio-safaridriver-service` as a devDependency in your `package.json`.

```json
{
  "devDependencies": {
    "wdio-safaridriver-service": "^0.0.1"
  }
}
```

You can simple do it by:

```bash
npm install wdio-safaridriver-service --save-dev
```

Instructions on how to install `WebdriverIO` can be found [here.](http://webdriver.io/guide/getstarted/install.html)

## Configure Safari to Enable WebDriver Support
Safari’s WebDriver support for developers is turned off by default. How you enable it depends on your operating system.

### High Sierra and later:

Run `safaridriver --enable` once. (If you’re upgrading from a previous macOS release, you may need to use sudo.)

### Sierra and earlier:

1. If you haven’t already done so, make the Develop menu available. Choose Safari > Preferences, and on the Advanced tab, select “Show Develop menu in menu bar.” For details, see [Safari Help](https://support.apple.com/guide/safari/welcome).

2. Choose Develop > Allow Remote Automation.

3. Authorize `safaridriver` to launch the XPC service that hosts the local web server. To permit this, manually run `/usr/bin/safaridriver` once and follow the authentication prompt.



## Configuration

By design, only Safari is available, and will only work on Mac OS. In order to use the service you need to add `safaridriver` to your service array:

```js
// wdio.conf.js
export.config = {
  // port to find safaridriver
  port: 4447, // if you want to specify the port. Default is 4444
  path: '/',
  // ...
  capabilities: [{
    /*
     * safaridriver can only handle 1 instance unfortunately
     * https://developer.apple.com/documentation/webkit/about_webdriver_for_safari
     */
    maxInstances: 1, 
  }],
  services: ['safaridriver'],

  // options
  safaridriverArgs: ['-p 4444'], // use the specified port. Default is 4444
  safaridriverLogs: './',
  // ...
};
```

## Options

### safaridriverArgs
Array of arguments to pass to the safaridriver executable.
* `-p` will use wdioConfig.port if not specified
* etc.

Type: `string[]`
### safaridriverLogs
Path where all logs from the safaridriver server should be stored.

Type: `string`



----

For more information on WebdriverIO see the [homepage](http://webdriver.io).
