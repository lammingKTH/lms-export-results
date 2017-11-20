const test = require('tape')
const rewire = require('rewire')
const sinon = require('sinon')

const indexController = rewire('../../server/controllers')
const exportResults = indexController.__get__('exportResults')

test('should redirect to the Canvas authentication page', t => {
  const res = {redirect: sinon.spy()}
  const req = {body: {}, get: () => ''}

  exportResults(req, res)

  t.equal(res.redirect.callCount, 1)
  t.end()
})
