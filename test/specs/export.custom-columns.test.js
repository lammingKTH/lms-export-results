const test = require('tape')
const sinon = require('sinon')
require('rewire-global').enable()

const _export = require('../../server/export')

const getCustomColumnsFn = _export.__get__('getCustomColumnsFn')

test.only('should return a function with user_id as argument, and the column data as return value', async t => {
  const userId = 123456
  const canvasCourseId = 0
  const canvasApi = {recursePages: sinon.stub()}
  const canvasApiUrl = ''
  const columnId = 1
  const columnId2 = 2

  // Columns
  canvasApi.recursePages.withArgs(`/courses/${canvasCourseId}/custom_gradebook_columns`).returns([
    {
      id: columnId,
      title: 'Anteckningar',
      position: 1,
      teacher_notes: true,
      hidden: false
    }, {
      id: columnId2,
      title: 'Nån annan kolumn',
      position: 2,
      teacher_notes: false,
      hidden: false
    }
  ])

  // Column data
  canvasApi.recursePages.withArgs(`/courses/${canvasCourseId}/custom_gradebook_columns/${columnId}/data`).returns(
    [
      {
        content: 'en anteckning...',
        user_id: userId
      }
    ]
  )

  canvasApi.recursePages.withArgs(`/courses/${canvasCourseId}/custom_gradebook_columns/${columnId2}/data`).returns(
    [
      {
        content: 'Nåt annat data i en kolumn',
        user_id: userId
      }
    ]
  )

  const {getCustomColumnsData} = await getCustomColumnsFn({canvasApi, canvasCourseId, canvasApiUrl})
  const result = getCustomColumnsData(userId)
  const expected = {
    [columnId]: 'en anteckning...',
    [columnId2]: 'Nåt annat data i en kolumn'
  }
  t.deepEqual(result, expected)
  t.end()
})