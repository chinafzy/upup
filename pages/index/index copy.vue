<template>
  <view>
    <input type="text" v-model="q" @input="changeQ" />
    <view v-html="svg"></view>
    <basics v-if="PageCur=='basics'"></basics>
    <components v-if="PageCur=='component'"></components>
    <plugin v-if="PageCur=='plugin'"></plugin>
    <view class="cu-bar tabbar bg-white shadow foot">
      <view class="action" @click="NavChange" data-cur="basics">
        <view class='cuIcon-cu-image'>
          <image :src="'/static/tabbar/basics' + [PageCur=='basics'?'_cur':''] + '.png'"></image>
        </view>
        <view :class="PageCur=='basics'?'text-green':'text-gray'">元素</view>
      </view>
      <view class="action" @click="NavChange" data-cur="component">
        <view class='cuIcon-cu-image'>
          <image :src="'/static/tabbar/component' + [PageCur == 'component'?'_cur':''] + '.png'"></image>
        </view>
        <view :class="PageCur=='component'?'text-green':'text-gray'">组件</view>
      </view>
      <view class="action" @click="NavChange" data-cur="plugin">
        <view class='cuIcon-cu-image'>
          <image :src="'/static/tabbar/plugin' + [PageCur == 'plugin'?'_cur':''] + '.png'"></image>
        </view>
        <view :class="PageCur=='plugin'?'text-green':'text-gray'">扩展</view>
      </view>
    </view>
  </view>
</template>

<script>
  import _ from 'lodash'

  async function nk(msg) {
    const resp = await uniCloud.callFunction({
      name: 'say-hello',
      data: {
        msg
      }
    })
    console.log(resp)

    const result = resp.result
    return resp.result.svg
  }
  
  export default {
    data() {
      return {
        PageCur: 'basics',
        svg: '',
        q: 'sat'
      }
    },
    methods: {
      NavChange: function (e) {
        this.PageCur = e.currentTarget.dataset.cur
      },
      changeQ: _.debounce(async function () {
        this.svg =await nk(this.q)
      }, 300)
    },
    async onLoad() {
      this.svg = await nk(this.q)
    }
  }

</script>

<style>

</style>
