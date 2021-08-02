<template>
  <view>
    <view class="cu-form-group margin-top">
      <textarea type="text" v-model="q" @input="changeQ" maxlength="-1"></textarea>
      <button type="primary" @click="share">分享</button>
    </view>
    <img :src="imgData" style="width: 100%;" />
  </view>
</template>

<script>
  import _ from 'lodash'

  async function nk(msg) {
    console.log(`do nk`)
    const resp = await uniCloud.callFunction({
      name: 'hello-jimp',
      data: {
        msg
      }
    })
    console.log('image resp:', resp)

    return resp.result.data
  }

  export default {
    data() {
      return {
        imgData: '',
        q: '请不要回答'
      }
    },
    methods: {
      changeQ: _.debounce(async function () {
        this.imgData = await nk(this.q)
      }, 1000),

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
      let ps = this.$route.query;
      this.q = ps.q

      this.$route.query.x = 1222

      this.imgData = await nk(this.q)
    }
  }

</script>

<style>

</style>
