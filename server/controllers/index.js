'use strict'
const log = require('kth-node-log')
const querystring = require('querystring')
const rp = require('request-promise')
const settings = require('../configuration').server
const CanvasApi = require('kth-canvas-api')
const csv = require('./csvFile')
const ldap = require('./ldap')

function exportResults (req, res) {
  let b = req.body
  // console.log(b)
  let courseRound = b.lis_course_offering_sourcedid
  const canvasCourseId = b.custom_canvas_course_id
  const fullUrl = (process.env.PROXY_BASE || (req.protocol + '://' + req.get('host'))) + req.originalUrl
  const nextUrl = fullUrl + '2?' + querystring.stringify({courseRound, canvasCourseId})
  log.info('Tell auth to redirect back to', nextUrl)
  const basicUrl = `https://${settings.canvas_host}/login/oauth2/auth?` + querystring.stringify({client_id: process.env.CANVAS_CLIENT_ID, response_type: 'code', redirect_uri: nextUrl})
  res.redirect(basicUrl)
}

async function exportResults2 (req, res) {
  let courseRound = req.query.courseRound
  const canvasCourseId = req.query.canvasCourseId
  log.info(`Should export for ${courseRound} / ${canvasCourseId}`)
  try {
    const ldapClient = await ldap.getBoundClient()
    const auth = await rp({
      method: 'POST',
      uri: `https://${settings.canvas_host}/login/oauth2/token`,
      body: {
        grant_type: 'authorization_code',
        client_id: process.env.CANVAS_CLIENT_ID,
        client_secret: process.env.CANVAS_CLIENT_SECRET,
        redirect_uri: req.protocol + '://' + req.get('host') + req.originalUrl,
        code: req.query.code
      },
      json: true
    })
    const canvasApi = new CanvasApi(`https://${settings.canvas_host}/api/v1`, auth.access_token)
    const assignments = await canvasApi.requestCanvas(`courses/${canvasCourseId}/assignments`)
    const assignmentIds = []
    const headers = {}
    for (let t of assignments) {
      const id = '' + t.id
      assignmentIds.push(id)
      headers[id] = `${t.name} (${t.id})`
    }
    const csvHeader = ['SIS User ID', 'ID', 'Name', 'Surname', 'PersonNummer'].concat(assignmentIds.map(function (id) { return headers[id] }))
    const students = await canvasApi.requestCanvas(`courses/${canvasCourseId}/students/submissions?grouped=1&student_ids[]=all`)
    // So far so good, start constructing the output
    res.status(200)
    res.contentType('csv')
    res.attachment(`${courseRound || 'canvas'}-results.csv`)
    res.write(csv.createLine(csvHeader))
    for (let student of students) {
      const ugUser = await ldap.lookupUser(ldapClient, student.sis_user_id)
      let row = {
        kthid: student.sis_user_id,
        givenName: ugUser.givenName,
        surname: ugUser.sn,
        personnummer: ugUser.norEduPersonNIN
      }
      for (let submission of student.submissions) {
        row['' + submission.assignment_id] = submission.entered_grade || ''
      }
      const csvLine = [student.sis_user_id || '', student.user_id || '', row['givenName'] || '', row['surname'] || '', row['personnummer'] || ''].concat(assignmentIds.map(function (id) { return row[id] || '-' }))
      // console.log(csvLine)
      res.write(csv.createLine(csvLine))
    }
    res.send()
  } catch (e) {
    log.error('Export failed:', e)
    res.status(500).send('Trasigt')
  }
}

module.exports = {
  // Do not remove the System controller!
  System: require('./systemCtrl'),

  exportResults,
  exportResults2
}
