'use strict'

const packageFile = require('../../package.json')
const getPaths = require('kth-node-express-routing').getPaths
const settings = require('../configuration').server
const ldap = require('./ldap')

/**
 * System controller for functions such as about and monitor.
 * Avoid making changes here in sub-projects.
 */
module.exports = {
  monitor: getMonitor,
  about: getAbout,
  robotsTxt: getRobotsTxt,
  paths: getPathsHandler,
  checkAPIKey: checkAPIKey,
  swagger: getSwagger
}

/**
 * GET /swagger.json
 * Swagger config
 */
function getSwagger (req, res) {
  res.json(require('../../swagger.json'))
}

/**
 * GET /_about
 * About page
 */
function getAbout (req, res) {
  const paths = getPaths()
  res.status(200).send(
    `<doctype html>
<html><head><title>${packageFile.name} ${packageFile.version}</title></head>
<body><h1>${packageFile.name} ${packageFile.version}</h1>
<p>${packageFile.description}</p>
<p>Canvas is ${settings.canvas_host}</p>
<p><a href="${paths.system.monitor.uri}">system status</a></p>
</body></html>
`)
}

/**
 * GET /_monitor
 * Monitor page
 */
async function getMonitor (req, res) {
  try {
    const ldapClient = await ldap.getBoundClient()
    const u1famwov = await ldap.lookupUser(ldapClient, 'u1famwov')
    let ldapStatus
    let globalStatus = 'OK'
    if (u1famwov.sn) {
      ldapStatus = `OK Could lookup u1famwov in ldap (got ${u1famwov.givenName} ${u1famwov.sn})`
    } else {
      ldapStatus = 'ERROR Failed to lookup u1famwov in ldap'
      globalStatus = 'ERROR'
    }
    res.type('text').status(200).send(
      `APPLICATION_STATUS: ${globalStatus}
LDAP: ${ldapStatus}`)
  } catch (err) {
    console.log(`Failed to display status page: ${err}`)
    res.type('text').status(500).send(`Error: ${err}`)
  }
}

/**
 * GET /robots.txt
 * Robots.txt page
 */
function getRobotsTxt (req, res) {
  res.type('text').render('system/robots')
}

/**
 * GET /_paths
 * Return all paths for the system
 */
function getPathsHandler (req, res) {
  res.json(getPaths())
}

function checkAPIKey (req, res) {
  res.end()
}
