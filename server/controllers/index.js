'use strict'
const log = require('../log')
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

async function getAccessToken ({clientId, clientSecret, redirectUri, code}) {
  const auth = await rp({
    method: 'POST',
    uri: `https://${settings.canvas_host}/login/oauth2/token`,
    body: {
      grant_type: 'authorization_code',
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      code
    },
    json: true
  })
  return auth.access_token
}

async function getAssignmentIdsAndHeaders ({canvasApi, canvasCourseId}) {
  const assignmentIds = []
  const headers = {}

  const assignments = await canvasApi.requestCanvas(`courses/${canvasCourseId}/assignments`)

  for (let t of assignments) {
    const id = '' + t.id
    assignmentIds.push(id)
    headers[id] = `${t.name} (${t.id})`
  }
  return {assignmentIds, headers}
}

async function createSubmissionLine ({student, ldapClient, assignmentIds}) {

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
  return [
    student.sis_user_id || '',
    student.user_id || '',
    row['givenName'] || '',
    row['surname'] || '',
    row['personnummer'] || ''
  ].concat(assignmentIds.map(id => row[id] || '-'))
}

async function exportResults2 (req, res) {
  const courseRound = req.query.courseRound
  const canvasCourseId = req.query.canvasCourseId
  log.info(`Should export for ${courseRound} / ${canvasCourseId}`)
  try {
    const ldapClient = await ldap.getBoundClient()
    const accessToken = await getAccessToken({
      clientId: process.env.CANVAS_CLIENT_ID,
      clientSecret: process.env.CANVAS_CLIENT_SECRET,
      redirectUri: req.protocol + '://' + req.get('host') + req.originalUrl,
      code: req.query.code
    })

    const canvasApi = new CanvasApi(`https://${settings.canvas_host}/api/v1`, accessToken)
    const students = await canvasApi.requestCanvas(`courses/${canvasCourseId}/students/submissions?grouped=1&student_ids[]=all`)

    // So far so good, start constructing the output
    const {assignmentIds, headers} = await getAssignmentIdsAndHeaders({canvasApi, canvasCourseId})
    const csvHeader = ['SIS User ID', 'ID', 'Name', 'Surname', 'PersonNummer'].concat(assignmentIds.map(id => headers[id]))
    res.status(200)
    res.contentType('csv')
    res.attachment(`${courseRound || 'canvas'}-results.csv`)
    res.write(csv.createLine(csvHeader))
    for (let student of students) {
      const csvLine = await createSubmissionLine({student, ldapClient, assignmentIds})
      res.write(csv.createLine(csvLine))
    }
    res.send('OK')
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
