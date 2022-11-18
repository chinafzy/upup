'use strict';

const
  Enhance = require('./enhance-promise'),
  Draw = require('./draw')

exports.main = async (event, context) => {
  //event为客户端上传的参数
  console.log('event : ', event)

  const args = event.queryStringParameters || event.body || event
  const type = args.type || 'png'
  const mime = `image/${type}`

  let imgB64 = await Draw
    .draw({
      msg: args.msg || '请不要回答！\n请不要回答！！\n否则你们将有危险！！！'
    })
    .then(img => img.getBufferAsync(mime))
    .then(imageData => imageData.toString('base64'))

  return event.queryStringParameters || event.body ? {
    mpserverlessComposedResponse: true, // 使用阿里云返回集成响应是需要此字段为true
    isBase64Encoded: true,
    statusCode: 200,
    headers: {
      'content-type': mime,
      'content-disposition': 'inline'
    },
    body: imgB64
  } : {
    data: `data:${mime};base64, ${imgB64}`
  }

};
