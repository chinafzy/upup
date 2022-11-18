"use strict";

const
  namedFnts = require('./named-fnts'),
  NetFiles = require('./net-files')

/**
 * Get a FNT description.
 *
 * @param {Object} name
 * @param {Array} items. Array of: item = String or item = {url: String, size: Int}
 * @return {String} Path to the FNT file. There are also png files for this FNT file.
 * @see 
 */
async function getFnt2(name, items) {
  let ps = items.map((item, idx) => {
    let saveName = idx == 0 ? `${name}.fnt` : `${name}${idx}.png`
    
    if (typeof (item) == 'string') item = {
      url: item
    }

    return NetFiles.get2(item.url, {
      name: saveName,
      ...item
    })
  })

  let arr = await Promise.all(ps)

  return arr[0]
}
exports.getFnt2 = getFnt2

async function getNamedFnt2(name) {
  let items = namedFnts[name]
  if (!items) {
    name = 'ms-yahei'
    items = namedFnts[name]
  }

  return await getFnt2(name, items)

}
exports.getNamedFnt2 = getNamedFnt2
