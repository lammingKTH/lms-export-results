function escapeCsvData (str) {
  str = '' + str

  if (str.includes(';')) {
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
