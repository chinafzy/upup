function lengthOfLines(lines) {
  return lines.reduce((c, line) => c + line.length, 0)
}

exports.splitLines = function splitLines(lines) {
  let ret = []
  let lines2 = []
  lines.forEach(line => {
    if (lengthOfLines(lines2) + line.length < 50) {
      lines2.push(line)
    } else {
      ret.push(lines2.join('\n'))
      lines2 = []
    }
  })

  if (lines2.length) ret.push(lines2.join('\n'))

  return ret
}
