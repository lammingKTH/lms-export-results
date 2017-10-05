'use strict'
// Load .env file if it exists
require('dotenv').config()
const packageFile = require('./package.json')

const config = require('./server/configuration').server
const server = require('./server/server')
const bunyan = require('bunyan')

console.log('Nu ska jag sätta upp bunyan...')
var log = bunyan.createLogger({
  name:'node-logger',
  app: packageFile.name
})
// test the logging...
log.info('Emil säger hej...')
log.error(new Error('Oh no! something something...'))

/* ****************************
 * ******* SERVER START *******
 * ****************************
 */
module.exports = server.start({
  useSsl: config.useSsl,
  pfx: config.ssl.pfx,
  passphrase: config.ssl.passphrase,
  key: config.ssl.key,
  ca: config.ssl.ca,
  cert: config.ssl.cert,
  port: config.port,
  logger: log
})
