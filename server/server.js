'use strict'
const server = require('kth-node-server')
// Load .env file in development mode (Do we need this here?  Its in app.js?)
require('dotenv').config()
// Now read the server config etc.
const config = require('./configuration').server
const AppRouter = require('kth-node-express-routing').PageRouter
// const getPaths = require('kth-node-express-routing').getPaths

// Expose the server and paths
// server.locals.secret = new Map()
module.exports = server
// module.exports.getPaths = () => getPaths()

/* ***********************
 * ******* LOGGING *******
 * ***********************
 */
const log = require('kth-node-log')
const packageFile = require('../package.json')

let logConfiguration = {
  name: packageFile.name,
  app: packageFile.name,
  env: process.env.NODE_ENV,
  level: config.logging.log.level,
  console: config.logging.console,
  stdout: config.logging.stdout,
  src: config.logging.src
}
log.init(logConfiguration)

/* ******************************
 * ******* ACCESS LOGGING *******
 * ******************************
 */
const accessLog = require('kth-node-access-log')
server.use(accessLog(config.logging.accessLog))

// QUESTION: Should this really be set here?
// http://expressjs.com/en/api.html#app.set
server.set('case sensitive routing', true)

/* *******************************
 * ******* REQUEST PARSING *******
 * *******************************
 */
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
server.use(bodyParser.json())
server.use(bodyParser.urlencoded({ extended: true }))
server.use(cookieParser())

/* **********************************
 * ******* APPLICATION ROUTES *******
 * **********************************
 */
// const addPaths = require('kth-node-express-routing').addPaths
const { notFoundHandler, errorHandler } = require('kth-node-api-common')
const { System, exportResults, exportResults2 } = require('./controllers')

// System pages routes
const systemRoute = AppRouter()
systemRoute.get('system.monitor', config.proxyPrefixPath.uri + '/_monitor', System.monitor)
systemRoute.get('system.about', config.proxyPrefixPath.uri + '/_about', System.about)
systemRoute.get('system.paths', config.proxyPrefixPath.uri + '/_paths', System.paths)
systemRoute.get('system.robots', '/robots.txt', System.robotsTxt)

server.use('/', systemRoute.getRouter())
server.all(config.proxyPrefixPath.uri + '/post', exportResults) // Deprecated, use /export instead
server.post(config.proxyPrefixPath.uri + '/export', exportResults)
server.all(config.proxyPrefixPath.uri + '/post2', exportResults2) // Deprecated, use /export2 instead
server.get(config.proxyPrefixPath.uri + '/export2', exportResults2)

// const express = require('express')

// Catch not found and errors
server.use(notFoundHandler)
server.use(errorHandler)

module.exports = server
