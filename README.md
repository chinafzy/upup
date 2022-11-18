# upup

JS做的一个举牌小人，可以直接运行于uniCloud。

![十年如一日](res/say.png "十年")

## 部署方式

### 本地快速预览

+ 在IDE HBuilderX下打开本项目。
+ 打开页面 `pages/index-dev/index-dev.vue`
+ 启动预览功能（使用下面的操作之一）。
  + 选择IDE右上角的预览。
  + 从菜单【运行】 -> 【运行到浏览器】 -> 【chrome】

第一次在本地预览，可能需要多一点的时间。

生成图片后，可以点击图片区域，会重新生成图片。


### 发布到云服务器
+ 创建一个uniCloud服务空间，开通“前端网页托管”，与当前项目绑定。
+ 在当前项目，使用`npm install`安装依赖。
+ 选择操作 【发行】 -> 【上传网站到服务器】，将当前项目发行到托管云端。
+ 在云控制台，打开【前端网页托管】，选择【参数配置】，找到默认的域名，点击这个链接，可以打开当前发布的网站。看见效果。

**注意：云平台可能会要求做身份验证以及手机号验证，才能发布网页。**



### 部署云函数
**注意：上面的步骤只发布了网页，后端服务依然在调用默认的demo服务。如果要使用自己的服务空间，请继续下面的步骤。**

+ 将云函数`hello-jimp`发布到服务器。
+ 在云控制台，`云函数URL化`，设置路径为：`/http/say`
+ 打开`pages/index/index.vue`，大约在38行左右，有个url，指向了默认的demo服务，将前面的域名部分删除，留下`/http/say?msg=${encodeURIComponent(piece)}&r=${Math.random()}`，这样就直接指向了自己的服务。
```js
changeQ: _.debounce(async function () {
  this.imgLines = splitLines(this.q.split('\n'))
    .map(piece =>
       `https://7ead79ba-e9c6-4108-8939-f1fc77cb2d31.bspapp.com/http/say?msg=${encodeURIComponent(piece)}&r=${Math.random()}`
    )
}, 1000),
```
+ 再次发布网站，查看发布后效果。


### 修改开发

云函数使用了一些外部的依赖，用编译压缩的方式来精简。

+ 在云函数`hello-jimp-dev`的目录下，运行`npm install`来安装依赖。
+ 修改`hello-jimp-dev`函数，使用`index-dev.vue`界面来预览。
+ 在`hello-jimp-dev`目录下，使用`npm run build`，将当前函数编译到`hello-jimp`。
+ 发布云函数`hello-jimp`，在网站上查看效果。


