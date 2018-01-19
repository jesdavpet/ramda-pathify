ramda-pathify-tag
=================

When working with [Ramda](http://ramdajs.com/) `path*` or `lens` functions a lot, hand-building path arrays becomes irritating.

This tag builds path arrays for [Ramda](http://ramdajs.com/), so you don't have to.


Step 1. Install it!
-------------------
```
> npm install ramda-pathify-tag
```
_**TODO:** publish to NPM_


Step 2. Use it!
---------------
Simply `pathify` a string that looks exactly how you'd reference the object property's path in JavaScript.

```javascript
const pathify = require('ramda-pathify-tag')
const { lensPath, view } = require('ramda')

const mcHammer = pathify`too.legit[0].tooLegit['to-quit']`
// ------------> ['too', 'legit', 0, 'tooLegit', 'to-quit']

const retro = lensPath(mcHammer)

const musicVideo = {
  too: {
    legit: [
      {
        tooLegit: { 'to-quit': `https://youtu.be/wiyYozeOoKs` }
      }
    ]
  }
}

view(retro, musicVideo) // --> https://youtu.be/wiyYozeOoKs
```


Step 3. Profit !!!
------------------

Useful when refactoring code that has unsafe references to deeply nested properties.

```diff
- const unsafe = (band) => band.too.legit[0].tooLegit['to-quit']
- unsafe(vanillaIce) // --> Error! Cannot reference property "legit" of undefined.
+ const safe = pathOr(`N/A`, pathify`too.legit[0].tooLegit['to-quit']`)
+ safe(vanillaIce)  // --> `N/A`
```
