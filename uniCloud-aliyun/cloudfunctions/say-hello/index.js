'use strict';

const fs = require('fs')
const {
  xfile
} = require('more')

const width_block = 109
const height_icon = 214
const height_header = width_block
const height_block = height_icon

const size_font = 30
const y_font = (height_header - size_font) / 2,
  x_font = (width_block - size_font) / 2
console.log(`x_font: ${x_font}; y_font: ${y_font}`)

const TextToSVG = require('text-to-svg');
const images = require("images");
const svg2png = require("svg2png");

async function getSvgDriver() {

  let ttfFile = await xfile.get2(
    'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-7ead79ba-e9c6-4108-8939-f1fc77cb2d31/acdb3a9c-fca4-4e7d-8893-9685d68802e9.ttf',
    'ttf-xxx.ttf'
  )

  return TextToSVG.loadSync(ttfFile)
}

function splitImgs(img) {
  let ret = []

  for (var i = 0; i < 33; i++) {
    var xpos = i % 9,
      ypos = (i - xpos) / 9
    // console.log(`${xpos} - ${ypos}`)

    ret.push(
      images(img, xpos * (195 + width_block) + 57, ypos * (150 + height_block) + 29, width_block, height_block)
      // .resize(width / 2, height / 2)
    )
  }

  return ret;
}

exports.main = async (event, context) => {
  //event为客户端上传的参数
  console.log('event : ', event)

  let textToSVG_p = getSvgDriver();
  let img_p = xfile.get2(
    'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-7ead79ba-e9c6-4108-8939-f1fc77cb2d31/d5cd6003-6230-4e2e-a912-4b3ed0858eba.png',
    'persons.png'
  )
  const textToSVG = await textToSVG_p
  const imgs = splitImgs(images(await img_p))

  // images(103 + 100, 198 + 100)
  //   .draw(imgs[9], 0, 0)
  //   .save('/tmp/1.png')

  // return

  let msg = event.msg || '你好啊\n方泽宇下午好\n明早好中午好'
  // let svg = textToSVG.getSVG(msg, options);

  let matrix = msg
    .split('\n')
    .map(line => line.split(''))

  let h = height_block * matrix.length
  // console.log(matrix.length, ' x ', matrix[0].length)
  let w = width_block * Math.max.apply(Math, matrix.map(line => line.length))
  console.log(`apply to canvas: ${w} x ${h}`)

  let ret = images(w, h)

  let attributes = {
    fill: 'black',
    stroke: 'black'
  }
  let ps = [];
  for (let i = 0; i < matrix.length; i++) {
    console.log(`deal row ${i} `)
    let row = matrix[i]
    for (let j = 0; j < row.length; j++) {
      let word = row[j]
      const i2= i, j2=j
      console.log(`deal ${j} x ${i}, ${word}`)

      if (!word) return;

      let p = new Promise((resolve, reject) => {
          let svg = textToSVG.getSVG(word, {
            fontSize: size_font,
            anchor: 'left top',
            attributes
          })
          console.log(` get svg`)
          resolve(svg)
        })
        .then(async (svg) => {
          let png = await svg2png(Buffer.from(svg), {})
          console.log('get png')
          return [png, i2, j2]
        })

      // await p

      ps.push(p)

    }
  }

  await Promise.all(ps)
    .then(pngs => pngs.forEach(([png, i, j]) => {
      ret.draw(imgs[Math.floor(Math.random() * 33)], j * width_block, i * height_block)
      ret.draw(images(png).rotate(40), j * width_block + 32, i * height_block)
      console.log(` write png`)
    }))
  // ret.draw(img, 0, 0)
  let file = '/tmp/abc.png'
  ret.save(file, {operation:10})
  // var x = ret.encode('png', {
  //   operation: 50
  // })
  // console.log('after coding:', x)

  // console.log(svg);

  //返回数据给客户端
  return {
    ...event,
    // svg
  }
};
