'use strict'

function exportResults (req, res) {
  res.attachment('file.csv') // Note: course code etc in filename would be nice
  res.status(200).send('namn,pnr\nkalle,7207xy')
}

module.exports = {
  // Do not remove the System controller!
  System: require('./systemCtrl'),

  exportResults: exportResults
}
