// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import Video from 'video.js';
import 'video.js/dist/video-js.css';
import Vant from 'vant';;
import 'vant/lib/index.css';

import axios from 'axios';
import VueAxios from 'vue-axios';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import VueAwesomeSwiper from 'vue-awesome-swiper';
import CryptoJS from "crypto-js";
import 'swiper/dist/css/swiper.css';
import animated from 'animate.css';
import md5 from 'js-md5';
import { Notify } from 'vant';
import Global from '@/components/Global'; // 引用模块
import moment from 'moment';//导入文件
Vue.prototype.$moment = moment;//赋值使用

Vue.use(Notify);
Vue.prototype.$md5 = md5;
Vue.prototype.$CryptoJS = CryptoJS;

Vue.use(animated)
Vue.use(VueAwesomeSwiper)


Vue.prototype.$Global = Global;
Vue.use(ElementUI);
Vue.use(Vant);

router.beforeEach((to, from, next) => {
  next();
})

axios.interceptors.request.use(config => {
  // Do something before request is sent
  var authentication = localStorage.getItem("authentication");
  if (authentication) {
    var token = JSON.parse(authentication).token;
    config.headers.common.Authorization = token;
  }
  return config;
}, error => {
  // Do something with request error
  return Promise.reject(error);
});
axios.interceptors.response.use(
  response => {
    // var code = response.data.code;
    // if (code !== 200) {
    //   ElementUI.Message.error(response.data.msg)
    // }
    return response;
  },
  err => {
    if (err.response == undefined) {
      Notify({ type: 'danger', message: '网络错误，请检查网络' });
      // return Promise.reject(err);
      // router.push('/login');
    }
    console.log(err.response)
    var statusCode = err.response.status;
    switch (statusCode) {
      case 400:
        Notify({ type: 'danger', message: '请求错误' });
        break;
      case 401:
        // Notify({ type: 'danger', message: '未授权，请登录' });
        router.push('/log');
        break;
      case 403:
        Notify({ type: 'danger', message: '拒绝访问' });
        break;
      case 404:
        Notify({ type: 'danger', message: '请求地址出错，请重试' });
        break;
      case 408:
        Notify({ type: 'danger', message: '请求超时' });
        break;

      case 500:
        Notify({ type: 'danger', message: '服务器内部错误' });
        break;

      case 501:
        Notify({ type: 'danger', message: '服务未实现' });
        break;

      case 502:
        Notify({ type: 'danger', message: '网关错误' });
        break;

      case 503:
        Notify({ type: 'danger', message: '服务不可用' });
        break;

      case 504:
        Notify({ type: 'danger', message: '网关超时' });
        break;

      case 505:
        Notify({ type: 'danger', message: 'HTTP版本不受支持' });
        break;

      default:
    }
    return Promise.reject(err);
  }
);
Vue.use(VueAxios, axios);
Vue.prototype.$video = Video

Vue.config.productionTip = false

/* eslint-disable no-new */
// new Vue({
//   el: '#app',
//   router,
//   components: { App },
//   template: '<App/>'
// })
var serverConfig;
// serverConfig = {
//   "Iosurl": "http://192.168.1.172:8062/h5#/",
//   "Pcurl": "http://192.168.1.172:8065/webConsumer#/",
//   'ip': "192.168.1.213",
//   'port': "18081",
// };
// Vue.prototype.serverConfig = serverConfig;
// Vue.prototype.server = server;
Vue.prototype.getConfigJson = function () {
  // Vue.prototype.baseUrl = result.data.baseUrl;//设置成Vue的全局属性;
  // console.log(result)

  axios.get('./serverConfig.json')
    .then(result => {
      serverConfig = {
        "addr": result.data.addr,
        "wsaddr": result.data.wsaddr,
        "login": result.data.login,
        "share": result.data.share,
        "Pcurl": result.data.Pcurl,
        "H5url": result.data.H5url,
        "Shareurl": result.data.Shareurl,
        "Interacturl": result.data.Interacturl,
        "vrName": result.data.vrName,
        "mqttaddr": result.data.mqttaddr,
        "type": result.data.type// vlist =>探视，interac =>打赏
      };
      Vue.prototype.serverConfig = serverConfig;
      axios.defaults.baseURL = result.data.addr;
      new Vue({
        el: '#app',
        router,
        components: { App },
        template: '<App/>'
      });
    })
    .catch(err => {
      console.error(err);
    })
}

Vue.prototype.getConfigJson()//调用声明的全局方法
// new Vue({
//   el: '#app',
//   router,
//   components: { App },
//   template: '<App/>'
// })