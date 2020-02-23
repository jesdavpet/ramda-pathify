/** Helper factory function which creates regex matching predicates.
    @param {Regexp} regexFromula
    @returns {Boolean}
    @private */
const isA = regexFormula => (regexFormula).test.bind(regexFormula)

/** @private */
const isAlpha = isA(/^[a-zA-Z]$/)

/** @private */
const isNumeric = isA(/^\-?[0-9]+$/) // NOTE: Negatives treated as in Ramda.

/** @private */
const isDot = isA(/^\.$/)

/** @private */
const isQuote = isA(/^\'|\"|\`$/)

/** @private */
const isOpenBracket = isA(/^\[$/)

/** @private */
const isCloseBracket = isA(/^\]$/)

/** @private */
const isLegalFirstCharacter = char => isAlpha(char) || isOpenBracket(char)

/** @private */
const interposeExpressionsIntoPathStrings = (pathStrings, value, i) => pathStrings
      .slice(0, i)
      .concat([`${pathStrings[i]}${value}`])
      .concat(pathStrings.slice(i+1))

/** Creates a path array (for consumption by Ramda) based on a path string.
    @param {String} pathStrings
    @returns {Array<String>}
    @throws
    @public */
function pathify (pathStrings, ...templateExpressions) {
  const hasArrayPathStrings = Array.isArray(pathStrings)
  const hasTemplateExpressions = hasArrayPathStrings && templateExpressions.hasOwnProperty(0)

  // Recast argument to support both tag and function calls.
  const pathString = hasTemplateExpressions
        ? templateExpressions.reduce(interposeExpressionsIntoPathStrings, pathStrings).join('')
        : hasArrayPathStrings
        ? pathStrings[0]
        : pathStrings

  // Check pre-conditions:
  const firstCharacter = pathString.charAt(0)
  if (!firstCharacter) {
    return []
  }

  if (!isLegalFirstCharacter(firstCharacter)) {
    throw new Error(`Must start with an alpha character or "["!`)
  }

  // Accumulate paths by iterating path string, omitting tokens.
  const tokenStack = []
  const pathFragments = []

  let isBracketModeActive = false
  let isQuoteModeActive = false

  let cursor = 0

  for (let c = 0; c < pathString.length; c++) {
    const character = pathString.charAt(c)
    const buffer = pathString.slice(cursor, c)
    const head = tokenStack.slice(-1)
    const peek = head[0]

    // Character: .
    if (isDot(character) && !isQuoteModeActive) {
      // Push dot into token stack when not inside of quotes.
      if (buffer) pathFragments.push(buffer)
      cursor = c + 1
    }

    // Character: [
    if (isOpenBracket(character) && !isQuoteModeActive) {
      if (isOpenBracket(peek)) throw new Error(`No nested square brackets!`)

      // When the buffer up to the open bracket is occupied, push it.
      if (buffer) pathFragments.push(buffer)
      isBracketModeActive = true
      tokenStack.push(`[`)
      cursor = c + 1
    }

    // Character: ]
    if (isCloseBracket(character) && isOpenBracket(peek)) {
      isBracketModeActive = false
      tokenStack.pop()

      // Numeric values must be treated differently for array indexing.
      const bracketed = isNumeric(buffer) ? parseInt(buffer) : buffer
      if (bracketed !== ``) pathFragments.push(bracketed)
      cursor = c + 1 // Skip cursor over closing bracket.
    }

    // Characters: " OR ` OR '
    if (isQuote(character)) {
      if (!isBracketModeActive) throw new Error(`Quotes must be in brackets!`)

      const isMatchingQuote = peek === character

      // Flag quote mode on when stack peek isn't a matching quote.
      if (!isMatchingQuote && !isQuoteModeActive) {
        isQuoteModeActive = true
        tokenStack.push(character)
      }

      // Flag quote mode off when stack peek is a matching quote.
      if (isMatchingQuote && isQuoteModeActive) {
        isQuoteModeActive = false
        tokenStack.pop()
        pathFragments.push(pathString.slice(cursor + 1, c))
        cursor = c + 1 // Skip cursor over closing quote.
      }
    }
  }

  // Check post-conditions:
  if (isQuoteModeActive) throw new Error(`Unmatched quote!`)
  if (isBracketModeActive) throw new Error(`Unmatched square bracket!`)

  // Collect remaining characters after the final delimiter (dot).
  if (cursor < pathString.length - 1) {
    pathFragments.push(pathString.slice(cursor))
  }

  return pathFragments
}

module.exports = pathify
