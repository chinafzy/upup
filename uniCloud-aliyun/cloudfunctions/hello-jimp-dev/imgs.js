"use strict";

const
  block_height = exports.block_height = 214,
  block_width = exports.block_width = 109

const
  Fs = require('fs'),
  NetFiles = require('./net-files'),
  Data64 = require('./data64'),
  Jimp = require('jimp')

// exports.getHumanImgs2 = async () => {
//   let imgPersons = await NetFiles.get2(
//       'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-7ead79ba-e9c6-4108-8939-f1fc77cb2d31/d5cd6003-6230-4e2e-a912-4b3ed0858eba.png', {
//         name: 'persons.png'
//       }
//     )
//     .then(Jimp.read.bind(Jimp))

//   console.log('image', imgPersons)

//   let imgs = Array(33).fill(0).map((_, z) => {
//     var xpos = z % 9,
//       ypos = (z - xpos) / 9

//     return imgPersons.clone().crop(
//       xpos * (195 + block_width) + 57, ypos * (150 + block_height) + 29,
//       block_width, block_height)
//   })
//   // console.log('imgs:', imgs)

//   return imgs;
// }

const humanImgs_p =
  // NetFiles.get2(
  //   'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-7ead79ba-e9c6-4108-8939-f1fc77cb2d31/d5cd6003-6230-4e2e-a912-4b3ed0858eba.png', {
  //     name: 'persons.png'
  //   }
  // )
  Promise.resolve(Buffer.from(Data64['persons.png'], 'base64'))
  .then(async resp => {
    let imgPersons = await Jimp.read(resp)

    console.log('image', imgPersons)

    let imgs = Array(33).fill(0).map((_, z) => {
      var xpos = z % 9,
        ypos = (z - xpos) / 9

      return imgPersons.clone().crop(
        xpos * (195 + block_width) + 57, ypos * (150 + block_height) + 29,
        block_width, block_height)
    })
    // console.log('imgs:', imgs)

    return imgs
  })
exports.getHumanImgs2 = async () => await humanImgs_p

const emptyImg_p =
  // NetFiles.get2(
  //   'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-7ead79ba-e9c6-4108-8939-f1fc77cb2d31/b7a1f880-306b-4afd-8a73-6b99f6bacb8e.png', {
  //     name: 'empty.png'
  //   })
  Promise.resolve(Buffer.from(Data64['empty.png'], 'base64'))
  .then(Jimp.read.bind(Jimp))

exports.getEmptyImg2 = async () => await emptyImg_p

// exports.imgs =
