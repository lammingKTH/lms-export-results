## LMS Export results

Export results (betygsunderlag) from canvas to something that can be
used for Ladok import (first attempt).

### Node version

This project uses node version 8.

    nvm install 8
    npm install
    npm run dev-server

http://localhost:3001/api/node/_about

#### Common errors

When trying to run node-api as a standalone you might encounter the following error:
```
return binding.open(pathModule._makeLong(path), stringToFlags(flags), mode);
```
This is because the SSL information is incorrect in localSettings.js. Set ```useSsl: false``` to avoid this.


#### Testing

The template project uses a [sample setup][sample-test] for
tests using [tape][tape]. It is not required to use this test
harness in your projects. Simply remove the sample code and
any reference to it in your project's `package.json` file.

Keep in mind that you still need to provide a working npm
script for `npm test` for the build server. If you don't want
or need tests, a simple `echo "ok"` will suffice.

[api]: https://github.com/KTH/node-api
[web]: https://github.com/KTH/node-web
[tape]: https://github.com/substack/tape
[sample-test]: test/unit/specs/sampleCtrl-test.js
[swagger]: http://swagger.io/
