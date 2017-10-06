'use strict'
// Load .env file if it exists
require('dotenv').config()

const config = require('./server/configuration').server
const server = require('./server/server')
const log = require('./server/log')
/* ****************************
 * ******* SERVER START *******
 * ****************************
 */

log.info(new Error('Error from info'))
log.error(new Error('Error from error'))
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
