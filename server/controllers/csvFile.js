function escapeCsvData (str) {
  str = '' + str

  if (str.includes('"')) {
    console.warn('oh no! bad data!', str)
  }

  if (str.includes(';')) {
    console.log('escaping ', str)
    str = `"${str}"`
  }

  return str
}

function createLine (strArr) {
  return strArr.map(escapeCsvData).join(';') + '\n'
}

module.exports = {
  createLine
}
