
# VR直播手机端 （探视）

## <font color="#dd0000">VR直播手机端 （探视）</font>

&nbsp;🐡&nbsp;根据控制端探视系统分配的探视用户进行手机观看直播（类似医院系统）

&nbsp;🎈&nbsp;VR全景直播，直播流切换

&nbsp;💓&nbsp;关注官方微信公众号“创维VR”，获取最新的VR设备内容

## 技术选型
 ###  前端技术选型
  vue ^2.6.10 [vue 轻型前端框架]  
  axios ^0.18.1 [axios 集成ajax请求库]  
  element ^2.10.1  [element 界面布局UI]  
  moment ^2.24.0 [moment 时间库]  
  three ^0.107.0 [three webgl 组件库]  
  mxreality ^0.107.0 [mxreality mxreality全景播放器 git地址：https://github.com/guoguicheng/mxreality.js]  
                              ......
  
## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

## 环境依赖
  "node": ">= 6.0.0"   
  "npm": ">= 3.0.0"  


## 版本
  ### v1.1.2
  直播列表  
  个人资料  
  直播控制  
  用户探视时间控制  
  机位可播放时间控制  
    
## 配置（修改）
``{
   "addr": "http://api-live-stage.skyworthxr.com",  
   "login": "true",  
   "share": "true",  
   "Pcurl": "http://skylive-stage.skyworthxr.com/webConsumer/#/",  
   "H5url": "http://skylive-stage.skyworthxr.com/h5#/",  
   "Shareurl": "http://skylive-stage.skyworthxr.com/share/#/",  
   "Interacturl": "http://skylive-stage.skyworthxr.com/interact/#/",  
   "vrName": "创维VR直播测试环境",  
   "mqttaddr": "47.112.135.8:18089",  
   "mqtthost": "47.112.135.8",  
   "mqttport": "18089",  
   "type": "interac",  
   "wsaddr": "ws://api-live-stage.skyworthxr.com",  
 };
```