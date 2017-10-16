/**
 *
 *            Server specific settings
 *
 * *************************************************
 * * WARNING! Secrets should be read from env-vars *
 * *************************************************
 *
 */
const { getEnv } = require('kth-node-configuration')

module.exports = {
  // The proxy prefix path if the application is proxied. E.g /places
  proxyPrefixPath: {
    uri: '/api/lms-export-results'
  },
  port: getEnv('SERVER_PORT', 3001),

  ldap:{
    base: getEnv('LDAP_BASE', 'ou=UG,dc=referens,dc=kth,dc=se'),
    url: getEnv('LDAP_URL', 'ldaps://ldap.referens.sys.kth.se'),
    userName: getEnv('LDAP_USERNAME', ''),
    password: getEnv('LDAP_PASSWORD', ''),
  },
  canvas:{
    host: getEnv('CANVAS_HOST', 'kth.test.instructure.com'),
    clientId: process.env.CANVAS_CLIENT_ID,
    clientSecret: process.env.CANVAS_CLIENT_SECRET,
  },
  // Custom app settings
  proxyBase:getEnv('PROXY_BASE', ''),
}
