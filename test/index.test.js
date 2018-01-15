const { expect } = require(`chai`)
const pathify = require(`../src/index`)

describe(`Tag pathify\`...\``, () => {
/* Positive test cases ********************************************************/
  it(`should result in an empty array with an empty tag literal`, () => {
    expect(pathify``).to.deep.equal([])
  })

  it(`should retain a single path without dots or brackets.`,  () => {
    const result = pathify`cats`
    expect(result).to.deep.equal([`cats`])
  })

  it(`should split path on dot notation`,  () => {
    const result = pathify`cats.paws`
    expect(result).to.deep.equal([`cats`, `paws`])
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

/* Negative test cases ********************************************************/
  it(`should throw an error if first character is not alpha`,  () => {
    const numeric = () => { pathify`0` }
    expect(numeric).to.throw()

    const quote = () => { pathify`'` }
    expect(quote).to.throw()

    const openBracket = () => { pathify`[0]` }
    expect(openBracket).to.throw()
  })

  it(`should throw an error if a quote is found outside a bracket`,  () => {
    const singleQuote = () => { pathify`cat's` }
    expect(singleQuote).to.throw()

    const doubleQuote = () => { pathify`"seriously"` }
    expect(doubleQuote).to.throw()

    const backTick = () => { pathify`O\`Grady` }
    expect(backTick).to.throw()
  })

  it(`should throw an error if a quote is never terminated`,  () => {
    const singleQuote = () => { pathify`cats['paw's']` }
    expect(singleQuote).to.throw()

    const doubleQuote = () => { pathify`cats["paw"s"]` }
    expect(doubleQuote).to.throw()

    const backTick = () => { pathify`cats[\`paw\`s\`]` }
    expect(backTick).to.throw()
  })

  it(`should throw an error if an open square bracket is never terminated`,  () => {
    const missingClose = () => { pathify`cats['paws'` }
    expect(missingClose).to.throw()

    const doubleOpen = () => { pathify`cats[['paws']` }
    expect(doubleOpen).to.throw()

    const missingOpen = () => { pathify`cats'paws']` }
    expect(missingOpen).to.throw()
  })
})
