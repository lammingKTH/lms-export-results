const bunyan = require('bunyan')
const packageFile = require('../package.json')

module.exports = bunyan.createLogger({
  name: 'node-logger',
  app: packageFile.name
  // serializers: {
  //   err: bunyan.stdSerializers.err
  // }
})
