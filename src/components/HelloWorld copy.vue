<template>
  <div class="hello">

    <div class=""
         id="videobox">
      <div v-if="vrtype">
        <div id="example"
             @dblclick="PauseVideo"></div>
      </div>
      <div v-else>
        <video id="myPlayer"
               poster=""
               controls
               playsInline
               webkit-playsinline>
          <source src="https://hls01open.ys7.com/openlive/f4b4267d320f47739dbb967781b3d084.hd.m3u8"
                  type="application/x-mpegURL" />
        </video>
      </div>
    </div>
    <div class="videoCont"
         v-show="vrplaytype">
      <img src="../assets/img/5132.png"
           @click="playvideos"
           alt="">
    </div>
    <div class="R_Sidebar">
      <ul>
        <li>
          <img v-if="vrtype"
               src="../assets/img/2D (1).png"
               alt="">
          <img v-else
               src="../assets/img/3D (1).png"
               alt="">
        </li>
        <li @click="V_mute">
          <img v-if="volumecondition"
               src="../assets/img/volume-2@2x.png"
               alt="">
          <img v-else
               src="../assets//img/volume-x@2x.png"
               alt="">
        </li>
        <li>
          <img src="../assets//img/share-2@2x.png"
               @click="Sharacondition=true"
               alt="">
        </li>
      </ul>
    </div>
    <div class="B_Sidebar">
      <div class="tool_select"
           v-show="toolcondition">
        <ul>
          <li v-for="(item, index) in vrlive"
              @touchstart="playVrlive(item)"
              :key="index">
            <p :class="{'activeLive':playVractive.id==item.id}">{{item.displayName}}</p>
          </li>
        </ul>
      </div>
      <div class="tool_active"
           @click='toolChange'>
        <p>{{playVractive.displayName}}
          <span v-if="toolcondition"><img src="../assets/img/top.png"
                 alt=""></span>
          <span v-else><img src="../assets/img/botttom.png"
                 alt=""></span>
        </p>
      </div>
      <div class="SharaCont"
           v-show="Sharacondition"
           @click="Sharacondition=false">
        <img src="../assets//img/share.png"
             alt="">
      </div>
    </div>

    <div class="pwdCont"
         v-show="P_condition">
      <div class="pwdBack"> <img src="../assets//img/973f79d05091a32fc58c0489567757d.png"
             alt=""></div>
      <div style="position: relative;z-index: 9999;">
        <p class="pwdtitle">输入密码</p>
        <p class="pwdtinfo"
           style="margin-bottom:40px;"
           :class="{'P_error':errorType}">{{pwderror}}</p>
        <van-password-input :value="videopwd"
                            :length="4"
                            :gutter="20"
                            :focused="showKeyboard"
                            @focus="onShowKey" />
      </div>
      <van-number-keyboard v-model="videopwd"
                           :show="show"
                           :length="4"
                           theme="custom"
                           extra-key="."
                           close-button-text="完成"
                           @blur="onblur"
                           @input="onInput"
                           @delete="onDelete" />
    </div>
  </div>
</template>

<script>
// import 'videojs-contrib-hls'
// require("videojs-vr");
// require("../assets/js/three.js")
// console.log(THREE)
// var THREE=new THREE
// require("../assets/renderers/CanvasRenderer.js")
// require("../assets/renderers/Projector.js")
// require("../assets/js/mxreality.js")
// require("../assets/js/ptools.js")
// require("videojs-contrib-hls");
require('../assets/js/ezuikit')
export default {
  name: "TestTwo",
  data () {
    return {
      _2dplayer: "",
      PlayIconCondition: false,
      playVractive: "",
      vrlive: "",
      myPlayer: "",
      src: "",
      toolcondition: false,
      Sharacondition: false,
      volumecondition: true,
      Mutetype: false,
      videopwd: "",
      showKeyboard: false,
      show: false,
      value: "",
      pwderror: "该直播需要输入密码观看",
      errorType: false,
      P_condition: false,
      shareId: "",
      vrcover: "",
      loadcondition: false,
      vrbox: '',
      vrtype: false,
      vr: "",
      vrplaytype: false
    };
  },
  mounted () {
    // eruda.init();
    // this.vrtype = this.serverConfig.vrtype == 8 ? true : false
    var Ispc = this.IsPC();
    var Rquery = this.$route.query;
    this.shareId = Rquery.shareId;

    // this.downApp(Rquery)
    // if (Rquery.parameter == "true") {
    //   // console.log(21)
    //   this.P_condition = true;
    // } else {
    //   this.P_condition = false;
    //   this.G_streamNopwd()
    // }
    console.log(EZuikit)
    this._2dplayer = new EZuikit.EZUIPlayer('myPlayer');
  },
  methods: {
    playvideos () {
      console.log(this.vr.video)
      if (this.vrplaytype) {
        this.vrplaytype = false;
        this.vr.video.play()
      } else {
        this.vrplaytype = true
        this.vr.video.pause()
      }

      var that = this;
      this.vr.video.addEventListener("pause", that.videopause)
    },
    IsPC () {
      var userAgentInfo = navigator.userAgent;
      var Agents = ["Android", "iPhone",
        "SymbianOS", "Windows Phone",
        "iPad", "iPod"];
      var flag = true;
      for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
          flag = false;
          break;
        }
      }
      return flag;
    },
    playVrlive (item) {
      if (this.playVractive.id == item.id) return false;
      var htmls =
        `
          <div id="example" @dblclick="PauseVideo"></div>
          `
      var videobox = document.getElementById("videobox");
      videobox.innerHTML = htmls
      this.playVractive = item;
      this.initVideo(item.hlsUrl)
    },
    downApp (Rquery) {
      var u = navigator.userAgent;
      var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1;//android端
      var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端 
      if (isAndroid) {
        console.log('安卓')
        //Android终端
        // this.$router.push({ path: '/', query: Rquery })
      }
      if (isIOS) {
        console.log('ios')
        //Android终端
        // this.$router.push({ path: '/Iosvrlive', query: Rquery })
      }
    },
    G_streamNopwd () {
      this.loadcondition = true
      var params = {
        type: "share",
        shareId: this.shareId,
      }
      this.axios.get("/lvms/api/stream", { params: params })
        .then(res => {
          var code = res.data.code;
          this.loadcondition = false
          this.PlayIconCondition = true;
          if (code !== 0) {
            this.pwderror = '密码错误请重试';
            this.errorType = true
          } else {
            this.PlayIconCondition = true;
            this.pwderror = '该直播需要输入密码观看';
            this.errorType = false
            this.show = false;
            this.P_condition = false;
            this.vrlive = res.data.data.items;
            this.playVractive = this.vrlive[0];
            this.src = this.playVractive.hlsUrl;
            this.vrcover = this.playVractive.cover;
            this.initVideo(this.playVractive.hlsUrl)
          }
        })
        .catch(err => {
          console.error(err);
        })
    },
    G_stream (pwd) {
      this.loadcondition = true
      var params = {
        type: "share",
        shareId: this.shareId,
        pwd: pwd
      }
      this.axios.get("/lvms/api/stream", { params: params })
        .then(res => {
          var code = res.data.code;
          this.loadcondition = false
          if (code !== 0) {
            this.pwderror = res.data.msg;
            this.errorType = true
          } else {
            this.pwderror = '该直播需要输入密码观看';
            this.errorType = false
            this.show = false;
            this.P_condition = false;
            this.PlayIconCondition = true;
            this.vrlive = res.data.data.items;
            this.playVractive = this.vrlive[0];
            this.src = this.playVractive.hlsUrl;
            this.vrcover = this.playVractive.cover;
            this.initVideo(this.playVractive.hlsUrl)
          }
        })
        .catch(err => {
          console.error(err);
        })
    },
    V_mute () {

      if (this.volumecondition) {
        this.vr.video.muted = true
        this.volumecondition = false
      } else {
        this.vr.video.muted = false
        this.volumecondition = true
      }
    },
    PlayVideo () {
      var videos = document.getElementById("myVideo_html5_api");
      videos.play()
      this.PlayIconCondition = false;
    },
    onblur () {
      if (this.videopwd.length < 4) {
        this.pwderror = '直播密码为四位数，请输入四位数';
        this.errorType = true
      } else {
        this.pwderror = '该直播需要输入密码观看';
        // this.errorType = false
        if (this.show == false) {
          return false;
        }
        this.show = false;

        this.G_stream(this.videopwd)
        // var videos = document.getElementById("myVideo_html5_api");
        // videos.play()
      }
    },
    onInput (value) {
      console.log(value)
    },
    onShowKey () {
      this.show = true
    },
    onDelete () {

    },
    toolChange () {
      if (this.toolcondition) {
        this.toolcondition = false
      } else {
        this.toolcondition = true
      }
    },
    pauses () {
      var box = document.getElementById("myVideo_html5_api");
      box.pause()
    },
    plays () {
      var box = document.getElementById("myVideo_html5_api");
      box.play()
    },
    initVideo (src) {
      var scene, renderer;
      var container;
      //renderer = new THREE.WebGLRenderer();
      AVR.debug = true;
      if (!AVR.Broswer.isIE() && AVR.Broswer.webglAvailable()) {
        renderer = new THREE.WebGLRenderer();
      } else {
        renderer = new THREE.CanvasRenderer();
      }
      renderer.setPixelRatio(window.devicePixelRatio);
      container = document.getElementById('example');
      container.appendChild(renderer.domElement);
      scene = new THREE.Scene();

      // fov 选项可调整初始视频远近
      this.vr = new VR(scene, renderer, container, { "fov": 50 });

      //vr.playText="<img src='img/play90.png' width='40' height='40'/>";
      this.vr.vrbox.radius = 600;
      if (AVR.isCrossScreen()) {
        // 调整vr视窗偏移量
        this.vr.effect.separation = 1.2;
      }
      var vr = this.vr
      this.vr.loadProgressManager.onLoad = function () {
        // 视频静音
        // vr.video.muted = false;
        vr.VRObject.getObjectByName("__mxrealityDefault").visible = true;
      }
      this.vr.loadProgressManager.onProgress = function () {
        console.log("onProgress")
      }
      this.vr.loadProgressManager.onError = function () {
        console.log("onError")
      }
      // vr.controls.gyroUnfreeze()
      //AVR.useGyroscope=false;
      this.vr.init(function () {

      });

      // this.vr.playPanorama('http://192.168.1.172:18085/live/live/stream_default_push2_AU/index.m3u8', vr.resType.sliceVideo);
      //        vr.playPanorama('http://192.168.1.172:18085/live/live/stream_default_push1_AE/index.m3u8',vr.resType.sliceVideo);
      vr.playPanorama(src, vr.resType.sliceVideo);
      this.vr.video.setAttribute("loop", "loop");
      this.vr.video.crossOrigin = "Anonymous";
      this.vr.video.onended = function () {

      }

      this.vr.video.pause();
      this.vrplaytype = true;
    },
    videopause () {
      this.vrplaytype = true
    },
    onclickPlay () {

      setTimeout(() => {

      },
        3000);
    },
    onClickLeft () {
      this.$router.push({ path: "/" });
    },
    PauseVideo () {
      console.log(11);
      this.vr.video.pause()
    },
  }
};
</script>
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.hello {
  width: 100%;
}

.video-js {
  width: 100%;
  height: 100%;
}

canvas {
  left: 0 !important;
  height: 100% !important;
  width: 100% !important;
}

body {
  padding: 0;
  margin: 0;
}

.pwdCont .pwdBack {
  /* background: url('../assets/img/973f79d05091a32fc58c0489567757d.png') */
  /* background: url('h5/vrlive/img/973f79d05091a32fc58c0489567757d.png') */
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 9998;
}

._toolBarArea {
  display: none !important;
}

.pwdCont .pwdBack img {
  width: 100%;
}

.van-number-keyboard {
  z-index: 9999 !important;
}
</style>
<style>
@import "../assets/css/style.css";
</style>