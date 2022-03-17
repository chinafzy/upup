'use strict';

const
  Enhance = require('./enhance-promise'),
  Draw = require('./draw')

exports.main = async (event, context) => {
  //event为客户端上传的参数
  console.log('event : ', event)

  const type = event.type || 'png'

  let image = await Draw.draw({
    msg: event.msg || '请不要回答！\n请不要回答！！\n否则你们将有危险！！！'
  })

  let imageData = await image.getBufferAsync(`image/${type}`)

  //返回数据给客户端
  return {
    ...event,
    data: `data:image/${type};base64, ` + imageData.toString('base64')
  }
};
