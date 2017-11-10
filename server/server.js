'use strict'
const server = require('kth-node-server')
// Now read the server config etc.
const config = require('./configuration').server
const AppRouter = require('kth-node-express-routing').PageRouter

// Expose the server and paths
// server.locals.secret = new Map()
module.exports = server
// module.exports.getPaths = () => getPaths()
//
const log = require('./log')

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
const { System, exportResults, exportResults2, exportResults3, exportDone } = require('./controllers')

// System pages routes
const systemRoute = AppRouter()
systemRoute.get('system.monitor', config.proxyPrefixPath.uri + '/_monitor', System.monitor)
systemRoute.get('system.about', config.proxyPrefixPath.uri + '/_about', System.about)
systemRoute.get('system.paths', config.proxyPrefixPath.uri + '/_paths', System.paths)
systemRoute.get('system.robots', '/robots.txt', System.robotsTxt)

server.use('/', systemRoute.getRouter())
server.get(config.proxyPrefixPath.uri, (req, res) => res.redirect(`${config.proxyPrefixPath.uri}/_about`))

server.post(config.proxyPrefixPath.uri + '/export', exportResults)
server.get(config.proxyPrefixPath.uri + '/export2', exportResults2)
server.get(config.proxyPrefixPath.uri + '/exportResults3', exportResults3)
server.get(config.proxyPrefixPath.uri + '/done', exportDone)

// Temp route
server.get(config.proxyPrefixPath.uri + '/test', (req, res) => res.send(`
  <html>
  TODO: Detta är bara en testsida för att kunna testa hela oath2-flödet i prod. Så fort som produktion funkar ska denna route tas bort.
  <form method="post" action="export">
    <input autofocus name="custom_canvas_course_id" value="2080"></input>
  </form>
  </html>
  `))

// Catch not found and errors
server.use(notFoundHandler)
server.use(errorHandler)

module.exports = server
