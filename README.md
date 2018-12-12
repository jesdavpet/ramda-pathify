[![CircleCI](https://circleci.com/gh/jesdavpet/ramda-pathify.svg?style=svg)](https://circleci.com/gh/jesdavpet/ramda-pathify)

ramda-pathify
=============

When working with [Ramda](http://ramdajs.com/) `path*` or `lens` functions a lot, hand-building path arrays gets tiresome.

Pathify builds path arrays for [Ramda](http://ramdajs.com/), so you don't have to!



Step 1. Install it!
-------------------
```bash
> npm install ramda-pathify
```



Step 2. Use it!
---------------
Simply `pathify` a string that looks exactly how you'd reference the object property's path in normal JavaScript code.

**Modern ES6 codebases can use pathify with tag syntax:**

```javascript
const { lensPath, view } = require('ramda')
const pathify = require('ramda-pathify')

const mcHammer = pathify`too.legit[0].tooLegit['to-quit']`
// ------------> ['too', 'legit', 0, 'tooLegit', 'to-quit']

const retro = lensPath(mcHammer)

const musicVideo = {
  too: {
    legit: [
      {
        tooLegit: { 'to-quit': 'https://youtu.be/wiyYozeOoKs' }
      }
    ]
  }
}

view(retro, musicVideo) // --> https://youtu.be/wiyYozeOoKs
```

**Legacy ES5 codebases can use pathify as a function instead:**

```javascript
const R = require('ramda')
const pathify = require('ramda-pathify')

const mcHammer = pathify('too.legit[0].tooLegit["to-quit"]')
// ------------> ['too', 'legit', 0, 'tooLegit', 'to-quit']

const retro = R.lensPath(mcHammer)

const musicVideo = {
  too: {
    legit: [
      {
        tooLegit: { 'to-quit': 'https://youtu.be/wiyYozeOoKs' }
      }
    ]
  }
}

R.view(retro, musicVideo) // --> https://youtu.be/wiyYozeOoKs
```



Step 3. Profit !!!
------------------

Useful when refactoring code that has unsafe references to deeply nested properties.

```diff
- const unsafe = (band) => band.too.legit[0].tooLegit['to-quit']
- unsafe(vanillaIce) // --> Error! Cannot reference property "legit" of undefined.
+ const safe = pathOr(`N/A`, pathify`too.legit[0].tooLegit['to-quit']`)
+ safe(vanillaIce)  // --> 'N/A'
```
