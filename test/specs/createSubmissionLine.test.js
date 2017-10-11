const test = require('tape')
const rewire = require('rewire')
const indexController = rewire('../../server/controllers')

test('should do something', t => {
  t.plan(1)
  t.equal(1, 1)
})
