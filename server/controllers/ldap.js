const Promise = require('bluebird')
const ldap = require('ldapjs')

async function getBoundClient () {
  const ldapClient = Promise.promisifyAll(ldap.createClient({
    url: process.env.LDAP_URL || 'ldaps://ldap.kth.se'
  }))
  await ldapClient.bindAsync(process.env.LDAP_USERNAME, process.env.LDAP_PASSWORD)
  return ldapClient
}

async function lookupUser (ldapClient, kthid) {
  const attributes = ['givenName', 'sn', 'norEduPersonNIN']
  const ldapResults = await ldapClient.searchAsync('ou=UG,dc=referens,dc=sys,dc=kth,dc=se', {
    scope: 'sub',
    filter: `(ugKthId=${kthid})`,
    timeLimit: 10,
    paging: true,
    attributes,
    paged: {
      pageSize: 1000,
      pagePause: false
    }
  })
  const ugUser = await new Promise((resolve, reject) => {
    const user = []
    ldapResults.on('searchEntry', ({object}) => user.push(object))
    ldapResults.on('end', () => resolve(user))
    ldapResults.on('error', reject)
  })
  if (ugUser.length > 0) {
    return ugUser[0]
  } else {
    return {}
  }
}

module.exports = {
  getBoundClient,
  lookupUser
}
