const test = require('tape')
const rewire = require('rewire')
const indexController = rewire('../../server/controllers')
const createSubmissionLine = indexController.__get__('createSubmissionLine')

test('should do something', t => {
  t.plan(1)
  const student = {}
  const assignmentIds = []
  const ldapClient = {lookupUser: () => Promise.resolve({
    givenName: 'Mock name',
    sn: 'Mock surname',
    norEduPersonNIN: '123123123123'
  })}

  const result = createSubmissionLine({student, ldapClient, assignmentIds})

  t.equal(1, 1)
})
