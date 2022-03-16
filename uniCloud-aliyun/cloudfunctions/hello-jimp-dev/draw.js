"use strict";

const {
  block_height,
  block_width,
  getHumanImgs2,
  getEmptyImg2
} = require('./imgs')

const {
  getNamedFnt2
} = require('./fnts')

const Jimp = require('jimp')

function hashMatrix(matrix, range) {
  let ret = matrix.map(row => row.map(cell => 0))

  for (let i = 0; i < ret.length; i++) {
    let row = ret[i];
    for (let j = 0; j < row.length; j++) {
      let v
      while (true) {
        v = Math.floor(Math.random() * range)

        if (i > 0) {
          if (j > 0 && matrix[i - 1][j - 1] == v) continue;

          if (matrix[i - 1][j] == v || matrix[i - 1][j + 1] == v) continue;
        }

        if (j > 0 && row[j - 1] == v) continue;

        break;
      }
      row[j] = v
    }
  }

  return ret
}

exports.draw = async function draw({
  msg = '写点什么好呢？\n小同学'
}) {

  let font_p = getNamedFnt2('ms-yahei')
    .then(Jimp.loadFont.bind(Jimp)),
    humanImgs_p = getHumanImgs2(),
    emptyImg_p = getEmptyImg2()

  let matrix = msg
    .split('\n')
    .map(line => line.split(''))

  let height = block_height * matrix.length,
    width = Math.max.apply(Math, matrix.map(line => line.length)) * block_width
  console.log(`canvas ${width} x ${height}`)

  let font = await font_p,
    humanImgs = await humanImgs_p,
    emptyImg = await emptyImg_p

  let canvas = emptyImg.clone().resize(width, height)

  let matrix2 = hashMatrix(matrix, humanImgs.length)
  console.log('matrix2', matrix2.map(row => '[' + row.join(', ') + ']'))

  matrix.forEach((row, i) => {
    row.forEach((cell, j) => {
      let idx = matrix2[i][j]
      console.log(`render image: ${idx}`)
      canvas.composite(humanImgs[idx], j * block_width, i * block_height, {
        mode: Jimp.BLEND_MULTIPLY,
        opacitySource: 1,
        opacityDest: 1
      })
      canvas.composite(emptyImg.clone().resize(40, 40, Jimp.RESIZE_BICUBIC) // 
        .print(font, 1, 1, {
          text: cell,
          alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
          alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
        })
        .rotate(-40),
        j * block_width + 29, i * block_height, {
          mode: Jimp.BLEND_MULTIPLY,
          opacitySource: 1,
          opacityDest: 1
        }
      )
    })
  })

  // canvas.write('/tmp/111.png')

  return canvas

}
