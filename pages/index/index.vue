<template>
  <view>
    <view class="cu-form-group margin-top">
      <textarea
        v-model="q"
        @input="changeQ"
        v-select-on-focus
        maxlength="-1"></textarea>
      <button type="primary" @click="share">分享</button>
    </view>
    <view style="width: 100%; overflow: scroll; "
      @click="changeQ"
      @tap="changeQ">
      <!-- <img :src="imgData" title="耐心等待,可以点击" /> -->
      <img v-for="(imgLine, _) in imgLines" :src="imgLine" />
      <!-- style="width: 100%;" -->
    </view>
  </view>
</template>

<script>
  import _ from 'lodash'
  import {
    splitLines
  } from '@/js_sdk/utils'

  export default {
    data() {
      return {
        imgLines: [],
        q: '请不要回答'
      }
    },

    methods: {
      changeQ: _.debounce(async function () {
        this.imgLines = splitLines(this.q.split('\n'))
          .map(piece =>
            `https://7ead79ba-e9c6-4108-8939-f1fc77cb2d31.bspapp.com/http/say?msg=${encodeURIComponent(piece)}&r=${Math.random()}`
          )
      }, 1000),

      onFocusQ(e) {
        console.log(`target`, e)
        // e.target.select()
        let node = this.$refs.qq
        let r = document.createRange()

        r.setStart(node, 0)
        r.setEnd(node, e.target.value.length)
      },

      share() {
        const reg = /([\?&])(q=[^&]*)/g;
        let url = window.location.href + '';
        let m = url.match(reg);
        console.log(url, `match:`, m)
        let newwords = `q=` + encodeURIComponent(this.q)
        let url2 = m ?
          url.replace(reg, (v1, v2, v3) => {
            console.log(v1, v2, v3)
            return v2 + newwords
          }) :
          (url + (url.includes('?') ? '&' : '?') + newwords)
        console.log('url2', url2)

        uni.setClipboardData({
          data: url2,
          success() {
            uni.showToast({
              title: '分享的链接已经加入粘贴板'
            })
          },
          fail() {
            uni.showToast({
              title: '分享失败'
            })
          }
        })
      }
    },

    async onLoad() {
      let ps = this.$route.query
      this.q = ps.q || '如果说十年如一日，\n那是活了十年？\n还是一天？'

      this.changeQ()
    }
  }

</script>

<style>

</style>
