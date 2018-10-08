const { expect } = require(`chai`)
const pathify = require(`../src/index`)

describe(`Tag pathify\`...\``, () => {
  /* Positive test cases */
  it(`should result in an empty array with an empty tag literal`, () => {
    const result = pathify``
    expect(result).to.deep.equal([])
  })

  it(`should retain a single path without dots or brackets.`,  () => {
    const result = pathify`cats`
    expect(result).to.deep.equal([`cats`])
  })

  it(`should split path on dot notation`,  () => {
    const result = pathify`cats.paws`
    expect(result).to.deep.equal([`cats`, `paws`])
  })

  it(`should accept redundant bracket notation (numeric)`, () => {
    const result = pathify`[0]`
    expect(result).to.deep.equal([0])
  })

  it(`should accept redundant bracket notation (string)`, () => {
    const result = pathify`['cats']`
    expect(result).to.deep.equal([`cats`])
  })

  it(`should split path on bracket notation (string)`,  () => {
    const result = pathify`cats['paws']`
    expect(result).to.deep.equal([`cats`, `paws`])
  })

  it(`should split path on bracket notation (strings, long)`,  () => {
    const result = pathify`cats['paws']['look']['like']['mittens']`
    expect(result).to.deep.equal([`cats`, `paws`, `look`, `like`, `mittens`])
  })

  it(`should split path on bracket notation (positive number)`,  () => {
    const result = pathify`cats[1234]`
    expect(result).to.deep.equal([`cats`, 1234])
  })

  it(`should split path on bracket notation (number zero)`,  () => {
    const result = pathify`cats[0]`
    expect(result).to.deep.equal([`cats`, 0])
  })

  it(`should split path on bracket notation (negative number)`,  () => {
    const result = pathify`cats[-1234]`
    expect(result).to.deep.equal([`cats`, -1234])
  })

  it(`should split path on bracket notation (numbers, long)`,  () => {
    const result = pathify`cats[9][0][2][1][0]`
    expect(result).to.deep.equal([`cats`, 9, 0, 2, 1, 0])
  })

  it(`should split path on bracket notation (decimal number)`,  () => {
    const result = pathify`cats['12.34']`
    expect(result).to.deep.equal([`cats`, `12.34`])
  })

  it(`should split path on bracket notation (empty string)`,  () => {
    const result = pathify`cats['']`
    expect(result).to.deep.equal([`cats`, ``])
  })

  it(`should split path on dot and bracket notation`,  () => {
    const result = pathify`cats.paws[0]`
    expect(result).to.deep.equal([`cats`, `paws`, 0])
  })

  it(`should split path on dot and bracket notation (long)`,  () => {
    const result = pathify`cats.paws[0].look.like['mittens'].for['kittens']`
    expect(result).to.deep.equal([`cats`, `paws`, 0, `look`, `like`, `mittens`, `for`, `kittens`])
  })

  it(`should allow other control characters inside quotes`, () => {
    const result = pathify`weird['"stuff].goes? [in-+/here!".]']`
    expect(result).to.deep.equal([`weird`, `"stuff].goes? [in-+/here!".]`])
  })

  /* Exception test cases */
  it(`should throw when first character is neither alpha nor open bracket`,  () => {
    const numeric = () => { pathify`0` }
    expect(numeric).to.throw()

    const quote = () => { pathify`'` }
    expect(quote).to.throw()

    const dot = () => { pathify`.` }
    expect(dot).to.throw()
  })

  it(`should throw when a quote is found outside a bracket`,  () => {
    const singleQuote = () => { pathify`cat's` }
    expect(singleQuote).to.throw()

    const doubleQuote = () => { pathify`"seriously"` }
    expect(doubleQuote).to.throw()

    const backTick = () => { pathify`O\`Grady` }
    expect(backTick).to.throw()
  })

  it(`should throw when a bracketed quote is never terminated`,  () => {
    const singleQuote = () => { pathify`cats['paw's']` }
    expect(singleQuote).to.throw()

    const doubleQuote = () => { pathify`cats["paw"s"]` }
    expect(doubleQuote).to.throw()

    const backTick = () => { pathify`cats[\`paw\`s\`]` }
    expect(backTick).to.throw()
  })

  it(`should throw when an open square bracket is never terminated`,  () => {
    const missingClose = () => { pathify`cats['paws'` }
    expect(missingClose).to.throw()

    const doubleOpen = () => { pathify`cats[['paws']` }
    expect(doubleOpen).to.throw()

    const missingOpen = () => { pathify`cats'paws']` }
    expect(missingOpen).to.throw()
  })
})

describe(`Function pathify(\`...\`)`, () => {
  it(`should return the same result as the tag`, () => {
    const tagResult = pathify`cats.paws[0].look.like['mittens'].for['kittens']`
    const functionResult = pathify(`cats.paws[0].look.like['mittens'].for['kittens']`)
    const expectedResult = [`cats`, `paws`, 0, `look`, `like`, `mittens`, `for`, `kittens`]
    expect(functionResult).to.deep.equal(expectedResult)
    expect(tagResult).to.deep.equal(functionResult)
  })
})

describe(`Expressions in tagged template string syntax spathify\`...\``, () => {
  it(`should return path evaluated with template string expressions`, () => {
    const location = 'Where'
    const whom = 'Weirdie'
    const tagResult = pathify`['${location}'].the.beans['at'].${whom}['?']`
    const expectedResult = [`Where`, `the`, `beans`, `at`, `Weirdie`, `?`]
    expect(tagResult).to.deep.equal(expectedResult)
  })

  it(`should return path evaluated with template numeric expressions`, () => {
    const number = 4
    const tagResult = pathify`the.fantastic[${number}]`
    const expectedResult = [`the`, `fantastic`, 4]
    expect(tagResult).to.deep.equal(expectedResult)
  })

  it(`should return path evaluated with string value of undefined`, () => {
    const nil = undefined
    const tagResult = pathify`not.defined.is['${nil}']`
    const expectedResult = [`not`, `defined`, `is`, `undefined`]
    expect(tagResult).to.deep.equal(expectedResult)
  })

  it(`should return path evaluated with string value of null`, () => {
    const nil = null
    const tagResult = pathify`nil.sounds.like['${nil}']`
    const expectedResult = [`nil`, `sounds`, `like`, `null`]
    expect(tagResult).to.deep.equal(expectedResult)
  })

  it(`should return path evaluated with string value of boolean`, () => {
    const bool = (4 > 1 && false !== true)
    const tagResult = pathify`alternatively['${bool}']`
    const expectedResult = [`alternatively`, `true`]
    expect(tagResult).to.deep.equal(expectedResult)
  })

  it(`should return path evaluated with empty string when provided`, () => {
    const tagResult = pathify`empty.expression['${''}']`
    expect(tagResult).to.deep.equal(['empty', 'expression', ''])
  })
})

