/** @param {String} pathStrings @returns {Array<String>} */
function pathify (pathStrings /* all other arguments ignored */) {
  const pathString = Array.isArray(pathStrings) ? pathStrings[0] : pathStrings

  const alpha = /[a-zA-Z]/
  const numeric = /^\-?[0-9]+$/
  const dot = /\./
  const quote = /\'|\"|\`/
  const openBracket = /\[/
  const closeBracket = /\]/
  const tokens = []
  const paths = []

  let bracketMode = false
  let quoteMode = false
  let start = 0

  for (let c = 0; c < pathString.length; c++) {
    const character = pathString.charAt(c)

    if (c === 0 && !alpha.test(character)) {
      throw new Error(`Must start with an alpha character!`)
    }

    if (dot.test(character) && !bracketMode && !quoteMode) {
      if (pathString.slice(start, c)) paths.push(pathString.slice(start, c))
      start = c + 1
    }

    if (openBracket.test(character) && !quoteMode) {
      if (tokens[tokens.length -1] === `[`) throw new Error(`Square brackets may not be nested!`)
      bracketMode = true
      tokens.push(`[`)
      if (pathString.slice(start, c)) paths.push(pathString.slice(start, c))
      start = c + 1
    }

    if (
      closeBracket.test(character) &&
      tokens[tokens.length -1] === `[` &&
      bracketMode &&
      !quoteMode
    ) {
      bracketMode = false
      tokens.pop()
      const bracketed = pathString.slice(start, c)

      if (bracketed) paths.push(numeric.test(bracketed) ? parseInt(bracketed) : bracketed)
      start = c + 1
    }

    if (quote.test(character)) {
      if (!bracketMode) throw new Error(`Quotes are only allowed in brackets!`)
      if (tokens[tokens.length -1] !== character && !quoteMode) {
        quoteMode = true
        tokens.push(character)
      } else if (tokens[tokens.length -1] === character && quoteMode) {
        quoteMode = false
        tokens.pop()
        paths.push(pathString.slice(start+1, c))
        start = c + 1
      }
    }
  }

  if (start < pathString.length) {
    paths.push(pathString.slice(start))
  }

  if (bracketMode) throw new Error(`Unmatched square bracket!`)
  if (quoteMode) throw new Error(`Unmatched quote!`)

  return paths
}

module.exports = pathify
