/** @param {String} pathStrings @returns {Array<String>} */
function pathify (pathStrings /* all other arguments ignored */) {
  // Recast argument to support both tag and function calls.
  const pathString = Array.isArray(pathStrings) ? pathStrings[0] : pathStrings

  const alpha = /^[a-zA-Z]$/
  const numeric = /^\-?[0-9]+$/
  const dot = /^\.$/
  const quote = /^\'|\"|\`$/
  const openBracket = /^\[$/
  const closeBracket = /^\]$/
  const tokens = []
  const paths = []

  let bracketMode = false
  let quoteMode = false
  let start = 0
  
  for (let c = 0; c < pathString.length; c++) {
    const character = pathString.charAt(c)
    const buffer = pathString.slice(start, c)
    const [peek] = tokens.slice(-1)

    // Throw when first character is invalid.
    if (c === 0 && (!alpha.test(character) && !openBracket.test(character))) {
      throw new Error(`Must start with an alpha character!`)
    }

    // Push dot into token stack when not inside of quotes.
    if (dot.test(character) && !quoteMode) {
      if (buffer) paths.push(buffer)
      start = c + 1
    }

    // Push open bracket into token stack when not inside of quotes.
    if (openBracket.test(character) && !quoteMode) {
      if (peek === `[`) throw new Error(`Square brackets may not be nested!`)
      // When the buffer up to the open bracket is occupied, push it.
      if (buffer) paths.push(buffer)
      bracketMode = true
      tokens.push(`[`)
      start = c + 1
    }

    // Push close bracket into token stack when matches opener, and not in quotes. 
    if (closeBracket.test(character) && peek === `[` && bracketMode && !quoteMode) {
      bracketMode = false
      tokens.pop()
      // Numeric values must be treated differently for array indexing.
      const bracketed = numeric.test(buffer) ? parseInt(buffer) : buffer 
      if (bracketed !== ``) paths.push(bracketed)
      start = c + 1
    }

    // Push quotes based on whether or not the stack peek matches quote type.
    if (quote.test(character)) {
      if (!bracketMode) throw new Error(`Quotes are only allowed in brackets!`)
      // Flag quote mode on when stack peek isn't a matching quote.
      if (peek !== character && !quoteMode) {
        quoteMode = true
        tokens.push(character)
      }
      // Flag quote mode off when stack peek is a matching quote.
      if (peek === character && quoteMode) {
        quoteMode = false
        tokens.pop()
        paths.push(pathString.slice(start + 1, c))
        start = c + 1
      }
    }
  }
  // Collect remaining characters after the final delimiter (dot).
  if (start < pathString.length - 1) paths.push(pathString.slice(start))

  // Bracket mode or quote mode flag being left on indicates an unmatched token.
  if (quoteMode) throw new Error(`Unmatched quote!`)
  if (bracketMode) throw new Error(`Unmatched square bracket!`)

  return paths
}

module.exports = pathify
