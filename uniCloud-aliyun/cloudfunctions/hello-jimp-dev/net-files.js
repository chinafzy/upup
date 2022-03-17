"use strict";

/**
 * 
 */
const Fs = require('fs')

const
  url2name = {},
  url2p = {}

let tmp_path = '/tmp/'

function findName(url) {
  return url2name[url] || (url2name[url] = encodeURIComponent(url))
}

/**
 * Build file checker.
 * 
 * @param  {int} size: file size
 * @param {fn} a function like check(file){}
 */
function buildChecker({
  size,
  checker
} = {}) {
  let checkers = []

  if (size !== undefined) {
    checkers.push((fileName) => {
      let size2 = Fs.statSync(fileName).size;
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

    return
  }
}

async function realGet2(url, {
  name,
  size,
  checker,
  folder,
  timeout = 10000
} = {}) {

  console.log(`build Promise for ${url}`)

  name = name || findName(url)

  if (!folder) folder = tmp_path

  if (!Fs.existsSync(folder)) Fs.mkdirSync(folder)

  const cacheName = fullPath(folder, name)

  let realChecker = buildChecker({
    size,
    checker
  })

  if (Fs.existsSync(cacheName)) {
    let cc = realChecker(cacheName)

    if (!cc)
      return cacheName

    console.log(`cached file expires: ${cc} `)
  }

  uniCloud.logger.info(`start downloading ${name} from ${url}`)

  let resp = await uniCloud.httpclient.request(url, {
    timeout,
    writeStream: Fs.createWriteStream(cacheName)
  })

  uniCloud.logger.info(`finish downloading ${name} from ${url}`, resp.status)

  if (resp.status != 200) {
    uniCloud.logger.error(`${resp.status} fail to download: ${url}`)
    Fs.rm(cacheName)
    throw `download fail: ${url}`;
  }

  let cc = realChecker(cacheName)
  if (!cc)
    return cacheName

  console.log(`downloaded file not match. url: ${url}; error: ${cc}`)
  Fs.rm(cacheName)

  throw `downloaded file ${url} does not pass. ${cc}`
}

/**
 * get one file
 * 
 * @param {string} url
 * @param {Object} size, name, checker, folder, timeout
 * @return {Promise} a promise refer to then saved file. 
 */
exports.get2 = async (url, opts = {}) => {
  return await (url2p[url] || (url2p[url] = realGet2(url, opts)))
}

function fullPath(folder, name) {
  return folder + (folder.endsWith('/') ? '' : '/') + name
}

/**
 * set work folder 
 * @param {string} path  
 */
exports.setFolder = (path) => {
  console.log(`change work folder to ${path}`)

  if (!Fs.existsSync(path)) Fs.mkdirSync(path)

  tmp_path = path
}

exports.setFolder('/tmp/net-files')

// console.log('net-files loaded.')
