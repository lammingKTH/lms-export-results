'use strict'
const querystring = require('querystring')
const rp = require('request-promise')
const settings = require('../configuration').server
const local = require('../../config/localSettings')
const CanvasApi = require('kth-canvas-api')

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

async function exportResults2 (req, res) {
  let courseRound = req.query.courseRound
  const canvasCourseId = req.query.canvasCourseId
  console.log(`Should export for ${courseRound} / ${canvasCourseId}`)
  try {
    const auth = await rp({
      method: 'POST',
      uri: `https://${settings.canvas_host}/login/oauth2/token`,
      body: {
        grant_type: 'authorization_code',
        client_id: local.client_id,
        client_secret: local.client_secret,
        redirect_uri: req.protocol + '://' + req.get('host') + req.originalUrl,
        code: req.query.code
      },
      json: true
    })
    console.log(auth)
    const canvasApi = new CanvasApi(`https://${settings.canvas_host}/api/v1`, auth.access_token)
    const foo = await canvasApi.requestCanvas(`courses/${canvasCourseId}/assignments`)
    console.log('=======================================================================')
    const assignmentIds = []
    const headers = {}
    for (let t of foo) {
      const id = '' + t.id
      assignmentIds.push(id)
      headers[id] = t.name
      // console.log(`${t.id} is "${t.name}"`)
    }
    console.log('-----------------------------------------------------------------------')
    console.log(['kthid'].concat(assignmentIds.map(function (id) { return headers[id] })))
    console.log('-----------------------------------------------------------------------')
    const data = await canvasApi.requestCanvas(`courses/${canvasCourseId}/students/submissions?grouped=1&student_ids[]=all`)
    for (let student of data) {
      let row = {
        kthid: student.sis_user_id
      }
      for (let submission of student.submissions) {
        row['' + submission.assignment_id] = `${submission.workflow_state} ${submission.entered_grade}`
      }
      console.log([student.sis_user_id].concat(assignmentIds.map(function (id) { return row[id] })))
    }
    console.log('-----------------------------------------------------------------------')
    // res.attachment(`${courseRound}-results.csv`)
    res.status(200).send('namn,pnr\nkalle,7207xy')
  } catch (e) {
    console.log(e)
    res.status(500).send('Trasigt')
  }
}

module.exports = {
  // Do not remove the System controller!
  System: require('./systemCtrl'),

  exportResults,
  exportResults2
}
