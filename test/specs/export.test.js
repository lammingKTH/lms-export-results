const test = require('tape')
const rewire = require('rewire')
const sinon = require('sinon')

const _export = rewire('../../server/export')
const exportResults = _export.__get__('exportResults')
const exportResults3 = _export.__get__('exportResults3')

test('should redirect to the Canvas authentication page', t => {
  const res = {redirect: sinon.spy()}
  const req = {body: {}, get: () => ''}

  exportResults(req, res)

  t.equal(res.redirect.callCount, 1)
  t.end()
})

test('should send status:500 if exportResults breaks', t => {
  const res = {status: sinon.stub().returns({
    send () {}
  })}
  const req = {body: {}, get: () => {
    throw new Error('Just pretending that something breaks...')
  }}

  exportResults(req, res)

  t.equal(res.status.getCalls()[0].args[0], 500)

  t.end()
})

test.only('should write a file', t => {
  const res = {redirect: sinon.spy()}
  const req = {query: {courseRound: 'round', canvasCourseId: 'canvasCourseId'}, get: () => ''}

  exportResults3(req, res)

  t.equal(res.redirect.callCount, 1)
  t.end()
})
