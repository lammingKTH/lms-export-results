const log = require('kth-node-log')
const Promise = require('bluebird')
const ldap = require('ldapjs')

function getBoundClient () {
  return new Promise((resolve, reject) => {
    const options = {
      url: process.env.LDAP_URL || 'ldaps://ldap.kth.se',
      timeout: 1000,
      connectTimeout: 1000,
      log: log
    }
    log.info('Should get ldap client for', options)
    const ldapClient = ldap.createClient(options)
    const doReject = function (e) {
      log.debug('In ldapClient rejection callback:', e)
      reject(e)
    }
    ldapClient.on('error', doReject)
    ldapClient.on('timeout', doReject)
    ldapClient.on('connectTimeout', doReject)
    ldapClient.bind(process.env.LDAP_USERNAME, process.env.LDAP_PASSWORD, function (err) {
      if (err) {
        reject(err)
      } else {
        log.info('Created bound ldap client')
        resolve(ldapClient)
      }
    })
  })
}

function lookupUser (ldapClient, kthid) {
  return new Promise((resolve, reject) => {
    log.info('Should try to search')
    ldapClient.search(
      'ou=UG,dc=referens,dc=sys,dc=kth,dc=se',
      {
        scope: 'sub',
        filter: `(ugKthId=${kthid})`,
        timeLimit: 10,
        paging: true,
        attributes: ['givenName', 'sn', 'norEduPersonNIN'],
        paged: {
          pageSize: 1000,
          pagePause: false
        }
      },
      function (err, res) {
        if (err) {
          log.debug('God err from search:', err)
          reject(err)
        } else {
          let user
          res.on('searchEntry', ({object}) => { user = object })
          res.on('end', () => resolve(user || {}))
          res.on('error', reject)
        }
      }
    )
  })
}

module.exports = {
  getBoundClient,
  lookupUser
}
