'use strict'
const querystring = require('querystring');
const settings = require('../configuration').server
const local = require('../../config/localSettings')


function exportResults (req, res) {
  console.log(req.body)
  let b = req.body
  // var course = b.context_label
  let courseRound = b.lis_course_offering_sourcedid
  const canvasCourseId = b.custom_canvas_course_id
  const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl
  const nextUrl = fullUrl+'2?'+querystring.stringify({courseRound, canvasCourseId })
  const basicUrl = `https://${settings.canvas_host}/login/oauth2/auth?`+querystring.stringify({client_id: local.client_id, response_type: 'code', redirect_uri: nextUrl})
  res.redirect(basicUrl)
  //res.attachment(`${courseRound}-results.csv`)
  //res.status(200).send('namn,pnr\nkalle,7207xy')
}

module.exports = {
  // Do not remove the System controller!
  System: require('./systemCtrl'),

  exportResults: exportResults
}
