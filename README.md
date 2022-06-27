# WDIO SafariDriver Service [![CI](https://github.com/webdriverio-community/wdio-safaridriver-service/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/webdriverio-community/wdio-safaridriver-service/actions/workflows/ci.yml)

This service helps you to run the Safari browser seamlessly when running tests with the [WDIO testrunner](http://webdriver.io/guide/testrunner/gettingstarted.html). It uses the [`/usr/bin/safaridriver`](https://developer.apple.com/documentation/webkit/testing_with_webdriver_in_safari) that comes with Safari/OSX.

Note - this service does not require a Selenium server, but uses the `/usr/bin/safaridriver` to communicate with the browser directly. Obvisously, it only supports:

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
    "wdio-safaridriver-service": "^1.0.0"
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

### High Sierra and later

Run `safaridriver --enable` once. (If you’re upgrading from a previous macOS release, you may need to use sudo.)

### Sierra and earlier

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
    services: [
        ['safaridriver', {
            outputDir: './logs',
            logFileName: 'wdio-safaridriver.log'
        }]
    ],
    // ...
};
```

## Options

### `port`
The port on which the driver should run on.

Example: `4444`
Type: `number`

### `args`

Array of arguments to pass to the safaridriver executable. `-p` will use wdioConfig.port if not specified.

Type: `string[]`

### `outputDir`

The path where the output of the Safaridriver server should be stored (uses the `config.outputDir` by default when not set).

Type: `string`

### `logFileName`

The name of the log file to be written in outputDir.

Type: `string`

----

For more information on WebdriverIO see the [homepage](http://webdriver.io).
