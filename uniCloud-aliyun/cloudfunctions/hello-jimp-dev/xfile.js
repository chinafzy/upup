"use strict";

const fs = require('fs')

let tmp_path = '/tmp/'

let url2name = {}
let url2p = {}

console.log('xfile loaded.')

function findName(url) {
  return url2name[url] || (url2name[url] = Math.random())
}

function buildChecker({
  size,
  checker
} = {}) {
  let checkers = []

  if (size !== undefined) {
    checkers.push((fileName) => {
      let size2 = fs.statSync(fileName).size;
      return size2 == size ? 0 : `size not match(${fileName}, ${size2} / ${size})`
    })
  }

  if (checker) checkers.push(checker)

  return (fileName) => {
    for (var i = 0; i < checkers.length; i++) {
      let checker = checkers[i];
      let ret = checker(fileName)
      if (ret) return ret;
    }

    return 0
  }
}

async function realGet2(url, {
  name,
  size,
  checker,
  timeout = 2000
} = {}) {

  console.log(`build Promise for ${url}`)

  name = name || findName(url)

  const cacheName = tmp_path + name
  let realChecker = buildChecker({
    size,
    checker
  })

  if (fs.existsSync(cacheName)) {
    let cc = realChecker(cacheName)

    if (!cc)
      return cacheName

    console.log(`cached file expires: ${cc} `)
  }

  uniCloud.logger.info(`start downloading ${name} from ${url}`)

  let resp = await uniCloud.httpclient.request(url, {
    timeout,
    writeStream: fs.createWriteStream(cacheName)
  })

  uniCloud.logger.info(`finish downloading ${name} from ${url}`, resp.status)

  if (resp.status != 200) {
    uniCloud.logger.error(`${resp.status} fail to download: ${url}`)
    fs.rm(cacheName)
    throw `download fail: ${url}`;
  }

  let cc = realChecker(cacheName)
  if (!cc)
    return cacheName

  console.log(`downloaded file not match. url: ${url}; error: ${cc}`)
  fs.rm(cacheName)

  throw `downloaded file ${url} does not pass. ${cc}`
}

exports.get2 = async function get2(url, opts = {}) {
  return await (url2p[url] || (url2p[url] = realGet2(url, opts)))
}

exports.getByName2 = async function getByName2(name) {

}

// export.register = func
