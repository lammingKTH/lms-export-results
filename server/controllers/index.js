'use strict'

function exportResults (req, res) {
  console.log(req.body)
  var b = req.body
  // var course = b.context_label
  var courseRound = b.lis_course_offering_sourcedid
  // var canvasCourseId = b.custom_canvas_course_id
  res.attachment(`${courseRound}-results.csv`)
  res.status(200).send('namn,pnr\nkalle,7207xy')
}

module.exports = {
  // Do not remove the System controller!
  System: require('./systemCtrl'),

  exportResults: exportResults
}
