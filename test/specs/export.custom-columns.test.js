const test = require('tape')
const rewire = require('rewire')
const sinon = require('sinon')
require('rewire-global').enable()
const proxyquire = require('proxyquire')

// class CanvasApi {
//   requestUrl (url) {
//     console.log('>>>>>>>> Mocking requestUrl <<<<<<<<', url)
//     return []
//   }
//   recursePages () {
//     console.log('>>>>>>>> Mocking recursePages <<<<<<<<')
//     return []
//   }
// }

const _export = require('../../server/export')

const getCustomColumnsFn = _export.__get__('getCustomColumnsFn')

test.only('should order the data for custom columns as {sis_user_id:[{customColumnData}]}', async t => {
  const sisUserId = 1
  const canvasCourseId = 1
  const canvasApi = {recursePages: sinon.stub()}
  const canvasApiUrl = ''
  const columnId = 1
  canvasApi.recursePages.withArgs('/courses/1/custom_gradebook_columns').returns([
    {
      'id': columnId,
      'title': 'Anteckningar',
      'position': 1,
      'teacher_notes': true,
      'hidden': false
    }
  ])

  canvasApi.recursePages.withArgs(`/courses/${canvasCourseId}/custom_gradebook_columns/${columnId}/data`).returns(
    [
      {
        'content': 'en anteckning...',
        'user_id': 8398
      }
    ]
  )

  const getCustomColumns = await getCustomColumnsFn({canvasApi, canvasCourseId, canvasApiUrl})
  const result = getCustomColumns(sisUserId)

  t.deepEqual(result, { '1': [ { content: 'en anteckning...', user_id: 8398 } ] })
  t.end()
})
