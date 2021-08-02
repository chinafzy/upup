'use strict';

const fs = require('fs')

exports.main = async (event, context) => {
  //event为客户端上传的参数
  console.log('event : ', event)

  // console.log('current:', __dirname, __filename)

  // Object.entries(process.env).forEach(([k, v]) => console.log('evn', k, v))
  fs.readdirSync('.').forEach(ff => {
    console.log('ff', ff)
    if (ff.isFile) {
      ff.readAsText()
    }
  })

  //返回数据给客户端
  return event
};
