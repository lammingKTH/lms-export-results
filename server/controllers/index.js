'use strict'
const querystring = require('querystring')
const settings = require('../configuration').server
const local = require('../../config/localSettings')

function exportResults (req, res) {
  let b = req.body
  console.log(b)
  let courseRound = b.lis_course_offering_sourcedid
  const canvasCourseId = b.custom_canvas_course_id
  const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl
  const nextUrl = fullUrl + '2?' + querystring.stringify({courseRound, canvasCourseId})
  console.log(nextUrl)
  const basicUrl = `https://${settings.canvas_host}/login/oauth2/auth?` + querystring.stringify({client_id: local.client_id, response_type: 'code', redirect_uri: nextUrl})
  res.redirect(basicUrl)
}

function exportResults2 (req, res) {
  let courseRound = req.query.courseRound
  const canvasCourseId = req.query.canvasCourseId
  console.log(`Shoule export for ${courseRound} / ${canvasCourseId}`)
  res.attachment(`${courseRound}-results.csv`)
  res.status(200).send('namn,pnr\nkalle,7207xy')
}

module.exports = {
  // Do not remove the System controller!
  System: require('./systemCtrl'),

  exportResults,
  exportResults2
}
