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
//
const rp = require('request-promise')
rp('https://api.ipify.org?format=json')
.then((ip) => log.info('ip:',ip))

module.exports = server.start({
  useSsl: false,
  port: config.port,
  logger: log
})
