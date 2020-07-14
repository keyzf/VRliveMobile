<template>
  <div :class="{ 'novrlive':!vrlength}">
    <div id="playWind"
         style=""
         ref="playWind">
      <div v-show="vrlength">
        <div v-show="btntype">
          <div class="initvideoimg"
               v-show="playcondition">
            <div>
              <div @mousedown="videomosemove">
                <img src="../assets/img/360.png"
                     alt="">
                <p class="_360">360度 拖动观看</p>
                <p class="playvideo"
                   @click="playvideo">点击开始播放</p>
              </div>
            </div>
          </div>
          <div class="initvideoimg"
               v-show="pausecondition">
            <div>
              <div>
                <img src="../assets/img/360.png"
                     alt="">
                <p class="_360">360度 拖动观看</p>
                <p class="playvideo"
                   @click="playvideo">点击开始播放</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="btntype">
        <div id="example"
             @dblclick="PauseVideo">
        </div>
      </div>
      <div id="playWind"
           style=""
           ref="playWind"
           v-if="!btntype">
        <div class="videobox">
          <div v-if="isIOS"
               style="width:100%;position: relative;top: -100px;">
            <video id="myPlayer"
                   controls="true"
                   playsInline
                   webkit-playsinline
                   autoplay>
              <source :src="camera2D.hlsAddr"
                      type="application/x-mpegURL" />
            </video>
          </div>
          <div v-else
               class="noios"
               id="videoboxcont"
               style="width:100%;position:relative">
            <video id="myPlayer"
                   controls="false"
                   ref="myPlayer"
                   playsInline
                   webkit-playsinline
                   autoplay>
              <source :src="camera2D.flvAddr"
                      type="rtmp/flv" />
            </video>
            <div class="volumenbox requestFullscreen">
              <img src="../assets/img/maximize-2.png"
                   @click="requestFullscreen"
                   alt />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="logoT">
      <van-image width="100%"
                 height="100%"
                 :src="logoimg" />
    </div>
    <div @click="touserinfo"
         class="userT">
      <van-image width="100%"
                 height="100%"
                 :src="userimg" />
    </div>
    <div class="livelist">
      <div>
        <div class=" clicktop"
             @click="livelistshow?livelistshow=false:livelistshow=true">
          <img src="../assets/img/botttom.png"
               v-if="livelistshow"
               alt="">
          <img src="../assets/img/top.png"
               v-else
               alt="">
        </div>
        <div class="livedesc">
          <div>
            <van-row type="flex"
                     justify="space-around">
              <van-col span="6"
                       style="text-align: left">
                <van-image width="80%"
                           :src="logoimg" />
              </van-col>
              <van-col span="18">
                <p class="livenames">
                  {{roominfo.name}}({{setids(roominfo.id)}})
                  <span style="float:right">
                    <van-icon style="color:#fff;font-size:18px;font-weight: 600; line-height: 30px;"
                              name="info-o"
                              @click="showinfos()" /></span>
                </p>
                <p style="width:90%"
                   class="livedesctxt">{{liveinfo.desc}}</p>
              </van-col>

            </van-row>
          </div>
        </div>
        <div style="padding:17px"
             v-show="livelistshow"
             class="livedesc ">
          <div>
            <swiper :options="swiperOption"
                    ref="mySwiper">
              <!-- slides -->
              <swiper-slide v-for="(item, index) in vrlive"
                            :key="index">
                <div class="slideLivelist "
                     @click="checkoutVideo(item)"
                     :class="{'slide-active':buildvideo==item.id}">
                  <div class="tag"
                       v-if="item.ctype==2">
                    <img src="../assets/img/camear2D.png"
                         alt="">
                  </div>
                  <div class="tag"
                       v-else>
                    <img src="../assets/img/vr.png"
                         alt="">
                  </div>
                  <p>{{item.displayName.substring(0,5)+'...(ID:'+setids(item.id)+')'}}</p>
                  <img :src="item.cover"
                       alt="">
                </div>
              </swiper-slide>
              <!-- Optional controls -->
            </swiper>
          </div>

        </div>
      </div>

    </div>
    <div class="toolbar">
      <ul>
        <li @click="overlayshowshera = true">
          <img src="../assets/img/share-2@2x.png"
               alt="">
          <p>分享</p>
        </li>
        <li @click="$router.push('/livelist')">
          <img src="../assets/img/grid@2x.png"
               alt="">
          <p>直播间</p>
        </li>
        <li @click="playkf">
          <img src="../assets/img/grid@2x.png"
               alt="">
          <p>播放</p>
        </li>
      </ul>
    </div>
    <van-overlay :show="overlayshowshera"
                 @click="overlayshowshera = false">
      <div class="wrapper"
           @click.stop>
        <div @click="overlayshowshera = false">
          <img src="../assets/img/share.png"
               style="width:100%"
               alt="">
        </div>
      </div>
    </van-overlay>
    <div class="nolive"
         v-if="!vrlength">
      <img style="width:66%"
           src="../assets/img/vrerror.png"
           alt="">
    </div>
    <div class="van-overlayCont">
      <van-popup v-model="overlayshow"
                 class="popupcont">
        <div class="liveinfosCont">
          <div style="text-align: right;color:#fff">
            <van-icon name="cross"
                      @click="overlayshow = false" />
          </div>

          <div v-if="overlayshow">
            <div class="liveinfos">
              <h3>{{popupinfo.name}}( {{setids(popupinfo.id)}})</h3>
              <p>
                {{popupinfo.desc}}
              </p>
            </div>
            <div class="liveinfos">
              <h3>
                直播公告
              </h3>
              <p>
                {{popupinfo.annonce}}
              </p>
            </div>
          </div>

        </div>
      </van-popup>
    </div>
    <div class="quitMode"
         v-show="quitShow">
      <div class="quitLive">
        <p class="quitTitle"> </p>
        <p class="quitwarning">已超过探视时间段 <br> 您将退出播放器</p>
        <div>
          <van-button class="confirm"
                      @click="quitLoad"
                      type="default">知道了</van-button>
        </div>
      </div>
    </div>
    <div class="quitMode"
         v-show="quitVr">
      <div class="quitLive">
        <p class="quitTitle"> </p>
        <p class="quitwarning">当前暂无直播 <br> 您将退出播放器</p>
        <div>
          <van-button class="confirm"
                      @click="quitLoad"
                      type="default">知道了</van-button>
        </div>
      </div>
    </div>
    <div class="quitMode"
         v-show="maxcl">
      <div class="quitLive">
        <p class="quitTitle"> </p>
        <p class="quitwarning">当前在线人数过多<br> 请稍后重试 </p>
        <div>
          <van-button class="confirm"
                      @click="quitLoad"
                      type="default">知道了</van-button>
        </div>
      </div>
    </div>
    <div ref="commel"
         v-show="kfshow"
         style="    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 90;">
    </div>
  </div>
</template>
<script>

// require('../assets/js/ezuikit')

import CanvasKeyFrames from 'canvaskeyframes'
import { Notify } from 'vant';
import aes from '../assets/js/AESencrypt';
export default {
  data () {
    return {
      Fullscreentype: false,
      quitVr: false,
      maxcl: false,
      settims: "",
      quitShow: false,
      desccondition: false,
      playcondition: true,
      pausecondition: true,
      popupinfo: {
        displayName: "", desc: "", id: "", notic: ""
      },
      overlayshowshera: false,
      overlayshow: false,
      livelistshow: false,
      vrlive: [
      ],
      overlay: true,
      radio: "",
      buildvideo: 1,
      swiperOption: {
        pagination: '.swiper-pagination',
        paginationClickable: true,
        autoplayDisableOnInteraction: false,
        loop: false,
        slideShadows: true,
        centeredSlides: false,
        slidesPerView: 3,
        spaceBetween: 5,
      },
      liveinfo: {},
      videoView: true,
      logoimg: require('../assets/img/users.png'),
      userimg: require('../assets/img/user@2x.png'),
      btntype: true,
      camera2dlist: [],
      isIOS: "",
      camera2D: {
        flvAddr: "",
        hlsAddr: ""
      },
      camearshow: "",
      vrlength: true,
      roominfo: "",
      periodsarr: [],
      ws: null,
      vr: "",
      kfshow: false,
      SmokeExplosion: [
        // require("../assets/rocketAni_04/01.png"),
      ],
      kf: "",
    }
  },

  created () {
  },
  mounted () {
    // eruda.init();
    var vid = this.$route.query.vid
    this.getroominfo(vid)
    this.handgetlivelist();
    this.downApp();
    this.handgetuserinfo()
    this.popupinfo = this.vrlive[0];
    this.linsocket();
    this.kfinit()
  },
  methods: {

    kfinit () {
      this.SmokeExplosion = []
      var imgarr = []
      var _this = this;
      var s = 0;
      for (let index = 0; index < 61; index++) {
        var src = "./static/rocketAni_04/" + (index + 1) + ".png";
        this.SmokeExplosion.push(src);
      }
      for (let index = 0; index < this.SmokeExplosion.length; index++) {
        (function (index) {
          const element = _this.SmokeExplosion[index];
          var imgs = new Image();
          imgs.onload = function () {
            // imgarr.push(imgs);
            imgarr[s] = imgs
            if (s == 60) {
              _this.KeyFrame(imgarr)
            }
            s++;
          };
          imgs.src = element;
        })(index);
      }
    },
    playkf () {
      this.kfshow = true;
      this.kf.play();
      var _this = this;
      setTimeout(() => {
        _this.kfshow = false;
        _this.kf.destroy();
        this.kfinit()
      }, 3300);
    },
    KeyFrame (imgarr) {
      var el = this.$refs.commel
      var type = "array";
      var options = {
        fps: 30,
        loop: 1,
        width: 750,
        height: 1334
      }
      this.kf = new CanvasKeyFrames(el, type, imgarr, options)
    },
    FullScreen () {
      var ele = this.$refs['myPlayer'];
      if (ele.requestFullscreen) {
        ele.requestFullscreen();
      } else if (ele.mozRequestFullScreen) {
        ele.mozRequestFullScreen();
      } else if (ele.webkitRequestFullScreen) {
        ele.webkitRequestFullScreen();
      }
    },
    //退出全屏
    exitFullscreen () {
      var de = this.$refs['myPlayer'];
      // console.log(de)
      if (de !== undefined) {
        if (de.exitFullscreen) {
          de.exitFullscreen();
        } else if (de.mozCancelFullScreen) {
          de.mozCancelFullScreen();
        } else if (de.webkitCancelFullScreen) {
          de.webkitCancelFullScreen();
        }
      }

    },
    linsocket () {
      var authentication = localStorage.getItem("authentication");
      var token = JSON.parse(authentication).token;
      var that = this;
      this.ws = new WebSocket(
        "ws://" + this.serverConfig.ip + ":" + this.serverConfig.port + "/lvms/api/extra/ws?token=" + token
      );
      this.ws.onmessage = function (evt) {
        var data = JSON.parse(evt.data);
        var types = data.type;
        if (types == 9) {
          if (data.data.id == that.buildvideo) {
            that.vrlength = false;
            that.quitVr = true;
            that.vr.video.pause()
          }
        } else if (types == 8) {
          if (data.data.id == that.buildvideo) {
            that.vrlength = true;
            that.quitVr = false;
            // that.vr.video.play()
          }
        }
      };
      this.ws.onclose = function (evt) {
        console.log(evt)
        // 关闭 websocket
        // alert("连接已关闭...");
      };
      this.ws.error = function (err) {
        console.log(err)
      };
    },
    quitLoad () {
      this.$router.push('/livelist')
    },
    pollTime (_this) {
      var time = _this.periodsarr;
      var canplay = false;
      if (time.length == 0) {
        canplay = true
      } else {
        time.forEach(element => {
          var times = _this.handcanplay(element);
          if (times == true) {
            canplay = true;
          }
        });
      }
      if (canplay == true) {

      } else {
        if (_this.vr) {
          _this.vr.video.pause()
        }
        _this.quitShow = true;
        var myPlayer = document.getElementById("myPlayer");
        if (myPlayer !== null) {
          myPlayer.pause()
        }
        clearInterval(_this.settims);

      }
    },
    getmusicklist (streamId) {
      this.axios.get('/lvms/api/source?stream=' + streamId)
        .then(res => {
          console.log(res)
        })
        .catch(err => {
          console.error(err);
        })
    },
    handgetuserinfo () {
      this.axios.get('/lvms/api/user/info')
        .then(res => {
          var data = res.data.data;
          var periods = data.items[0].periods;
          var canplay = false;
          this.periodsarr = JSON.parse(periods);
          var _this = this;
          this.settims = setInterval(() => {
            _this.pollTime(_this)
          }, 3000);
        })
        .catch(err => {
          console.error(err);
        })
    },
    handcanplay (periods) {
      var time = periods;
      var nowTime = this.$moment().format("YYYY-MM-DD HH:mm:ss");
      var startTime = time.start;
      var endTime = time.end;
      var istime = this.$moment(nowTime).isBetween(startTime, endTime);
      return istime;
    },
    changeVRview (type) {
      this.btntype = type
      if (type) {

      }
    },
    log (str, className) {
      console.log(str)
      if (str == "开启声音成功") {
        if (window.orientation == 90 || window.orientation == -90) {
        } else if (window.orientation == 0 || window.orientation == 180) {
        }
      } else if (str == '使用flv.js播放') {
      }
    },
    get2dcamera () {
      this.camera2dlist = []
      var vid = this.$route.query.vid
      this.axios.get('/lvms/api/camera2D?room=' + vid)
        .then(res => {
          var camera2dlist = res.data.data.items;
          var data = []
          if (camera2dlist.length == 0) {
            if (this.vrlive.length == 0) {
              Notify({ type: 'warning', message: '当前视频未有全景直播和平面直播，请联系管理员，' });
              return false
            } else {
            }
          }
          camera2dlist.forEach((i, k) => {
            i.displayName = i.name
            i.ctype = 2
            if (i.status == 1) {
              data.push(i)
            }
          })
          if (this.vrlive.length == 0) {
            this.vrlive.push(...data)
            this.vrlength = true;
            this.btntype = false
            var vid = this.vrlive[0].id;
            this.getcamerainf(vid);
          }
          console.log(data)
          this.vrlive.push(...data)
          // console.log(this.vrlive)
        })
        .catch(err => {
          console.error(err);
        })
    },
    getcamerainf (id) {
      let authentication = JSON.parse(localStorage.getItem("authentication"));
      var token = authentication.token
      this.axios.get('/lvms/api/camera2D/' + id + '/info', {
        headers: {
          Authorization: token
        }
      })
        .then(res => {
          if (res.data.code !== 0) {
          } else {
            if (this.vr !== "") {
              this.vr.video.pause()
              this.vr = null;
            }
            var info = res.data.data
            var hlsAddr = aes.decryptText(authentication.word, info.hlsAddr);
            var flvAddr = aes.decryptText(authentication.word, info.flvAddr);
            this.camera2D = info;
            this.buildvideo = info.id;
            this.camera2D.hlsAddr = hlsAddr;
            this.camera2D.flvAddr = flvAddr;
            this.camearshow = true;
            var _this = this
            this.$nextTick(() => {
              setTimeout(() => {
                var player = new EZuikit.EZUIPlayer('myPlayer');
                // 日志
                player.on('log', _this.log);
              }, 1000);
            })
          }
        })
        .catch(err => {
          console.error(err);
        })
    },
    downApp (Rquery) {
      var u = navigator.userAgent;
      var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1;//android端
      var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端 
      if (isAndroid) {
        console.log('安卓')
        this.isIOS = false;
      }
      if (isIOS) {
        console.log('ios')
        this.isIOS = true;
      }
      console.log(this.isIOS)
    },
    wordArrayToHexStr (array) {
      var hexStr = "";
      for (var i = 0; i < array.length; i++) {
        var num = array[i];
        if (num < 0) {
          num = array[i] + 0x100000000;
        }
        var str = num.toString(16).toUpperCase();
        var fullStr = str;
        if (str.length < 8) {
          for (var j = 0; j < 8 - str.length; j++) {
            fullStr = "0" + fullStr;
          }
        }
        hexStr = hexStr + fullStr;
      }
      var ret = "";
      for (var i = 0; i < hexStr.length; i += 2) {
        ret = ret + hexStr.substr(i, 2) + " "
      }
      return ret.substr(0, ret.length - 1);
    },
    pollinitVr (live) {
      if (this.vr == "") {

      }
    },
    handgetliveinfo (vid) {
      this.axios.get('/lvms/api/stream/' + vid + '/info')
        .then(res => {
          if (res.data.code == 0) {
            let authentication = JSON.parse(localStorage.getItem("authentication"));
            this.liveinfo = res.data.data;
            this.desccondition = true
            this.buildvideo = this.liveinfo.id;
            var decryptText = aes.decryptText(authentication.word, this.liveinfo.hlsUrl)
            this.getmusicklist(this.buildvideo)
            this.initVideo(decryptText)
            if (this.vr) {
              this.vr.video.pause()
            }
          } else {
            if (res.data.code == 602) {
              if (res, data.msg == "不在探视时间内") {
                this.quitShow = true
              } else {
                this.maxcl = true
              }
            }
          }
        })
        .catch(err => {
          console.error(err);
        })
    },
    setids (id) {
      var ids = id + '';
      var len = ids.length;
      if (ids.length < 6) {
        while (len < 6) {
          ids = "0" + ids;
          len++;
        }
      }
      return ids
    },
    handgetlivelist () {
      var vid = this.$route.query.vid;
      this.vrlive = []
      this.axios.get("/lvms/api/stream?room=" + vid)
        .then(res => {
          var vrlive = res.data.data.items;
          vrlive.forEach((i, k) => {
            i.ctype = 1
            if (i.status !== 0) {
              this.vrlive.push(i)
            }
          })
          if (this.vrlive.length == 0) {
            Notify({ type: 'warning', message: '当前暂无直播，请切换或者联系管理员' });
            this.vrlength = false;
          } else {
            var vid = this.vrlive[0].id;
            this.handgetliveinfo(vid);
          }
        })
        .catch(err => {
          console.error(err);
        })
    },
    showinfos () {
      this.popupinfo = this.roominfo;
      this.overlayshow = true;
    },
    checkoutVideo (item) {
      if (this.ws == null) {
        this.linsocket()
      }
      if (item.ctype == 2) {
        this.vrlength = true;
        this.btntype = false
        this.$nextTick(() => {
          this.getcamerainf(item.id)
        })
      } else {
        this.btntype = true;
        this.$nextTick(() => {
          this.handgetliveinfo(item.id);
        })
      }

    },
    videomosemove () {
      alert('11')
    },
    PauseVideo () {
      this.vr.video.pause()
    },

    initVideo (src) {
      var _this = this
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
      if (container == null) {
        this.initVideo(src);
        return false;
      }
      if (renderer.domElement == undefined) {
        this.initVideo(src);
        return false;
      }
      container.appendChild(renderer.domElement);
      scene = new THREE.Scene();
      // fov 选项可调整初始视频远近
      this.vr = new VR(scene, renderer, container, { "fov": 80 });
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
        vr.video.pause()
        vr.VRObject.getObjectByName("__mxrealityDefault").visible = true;
      }
      this.vr.loadProgressManager.onProgress = function () {
        console.log("onProgress")
      }
      this.vr.loadProgressManager.onError = function () {
        console.log("onError")
      }
      this.vr.init(function () {
      });
      vr.playPanorama(src, vr.resType.sliceVideo);
      this.vr.video.setAttribute("playsInline", "");
      this.vr.video.setAttribute("webkit-playsinline", "");
      //  playsInline
      //  webkit-playsinline
      this.vr.video.crossOrigin = "Anonymous";
      this.vr.video.onended = function () {
        this.vr.video.pause()
      };
      this.vrplaytype = true;
      this.vr.video.addEventListener('pause', function () {//播放开始执行的函数
        _this.pausecondition = true;
      });
      this.vr.video.pause();
      // this.get2dcamera()

    },
    playvideo () {
      this.vr.video.play()
      this.playcondition = false;
      this.pausecondition = false;
    },
    tolist () {
      this.$router.push({ path: '/' })
    },
    touserinfo () {

      this.$router.push({ path: '/userinfo' })
    },
    getroominfo (vid) {
      this.axios.get("/lvms/api/room/" + vid + "/info")
        .then(res => {
          this.roominfo = res.data.data
        })
        .catch(err => {
          console.error(err);
        })
    },
    vueexitFullscreen () {

    },
    requestFullscreen () {
      // 全屏兼容代码
      if (this.Fullscreentype == false) {
        var ele = document.getElementById("videoboxcont");
        if (ele.requestFullscreen) {
          ele.requestFullscreen();
        } else if (ele.webkitRequestFullscreen) {
          ele.webkitRequestFullscreen();
        } else if (ele.mozRequestFullScreen) {
          ele.mozRequestFullScreen();
        } else if (ele.msRequestFullscreen) {
          ele.msRequestFullscreen();
        }
        this.Fullscreentype = true;
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        }
        this.Fullscreentype = false;
      }
    }
  },
  destroyed () {
    this.vr.video.pause();
    this.$refs['myPlayer'].pause();
    if (this.ws == null) {
      this.ws.close()
    }
  },

}   
</script>
<style scoped>
.liveinfos {
  text-align: left;
  margin-bottom: 27px;
}

.liveinfos p {
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
}

.liveinfos h3 {
  font-size: 18px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: rgba(255, 255, 255, 1);
  margin: 0;
  margin-bottom: 10px;
}

.popupcont {
  background: transparent;
  z-index: 96999999 !important;
}

p {
}

.requestFullscreen {
  position: absolute;
  bottom: 1%;
  left: 3%;
  width: 40px;
  height: 40px;
}
.requestFullscreen img {
  width: 100%;
}
.logoT {
  position: absolute;
  left: 17px;
  top: 17px;
  width: 44px;
  height: 44px;
  z-index: 2;
}

.userT {
  position: absolute;
  right: 17px;
  top: 27px;
  width: 18px;
  height: 20px;
  z-index: 2;
}

.slideLivelist {
  height: 67px;
  position: relative;
}

.slideLivelist .tag {
  position: absolute;
  width: 40px;
  height: 20px;
  left: 0;
  top: 0;
  z-index: 9;
}

.slide-active .tag {
  left: -1px;
  top: -1px;
}

.clicktop {
  height: 25px;
  background: rgba(0, 0, 0, 0.4);
  line-height: 25px;
  text-align: center;
}

.clicktop img {
  width: 17px;
}

.livelist {
  width: 100%;
  position: absolute;
  bottom: 0%;
  z-index: 9999999;
}

.nolive {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  background-color: #cac3c3;
  padding-top: 32%;
}

.nolive img {
}

.initvideoimg {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 2;
}

.initvideoimg > div {
  position: absolute;
  top: 0;
  width: 100%;
  left: 0;
  height: 75%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.initvideoimg > div img {
  width: 148px;
}

.initvideoimg > div p {
  height: 50px;
  line-height: 50px;
}

.initvideoimg > div p._360 {
  font-size: 16px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
}

.initvideoimg > div p.playvideo {
  font-size: 20px;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: rgba(255, 255, 255, 1);
}

.initvideoimg > div p:last-child {
}

.livedesc {
  padding: 10px 17px;
  background: rgba(0, 0, 0, 0.3);
}

.livedesc .van-row--justify-space-around {
  align-items: center;
}

.livenames {
  font-size: 18px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: rgba(255, 255, 255, 1);
  text-align: left;
  height: 30px;
  line-height: 30px;
}

.livedesctxt {
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
  text-align: left;
}

.slideLivelist img {
  width: 100%;
  height: 100%;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  transform: scale(1);
}

.swiper-slide {
  width: 33% !important;
}

.swiper-slide .slide-active {
  border: 1px solid rgba(253, 172, 58, 1);
  transform: scale(1.01);
  border-radius: 5px;
  position: relative;
  top: -2px;
}

.livedesc .swiper-container {
  overflow: inherit;
  height: 85px;
}

.slideLivelist p {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 9;
  color: #fff;
  text-align: center;
  width: 100%;
  /* height: 100%; */
  /* line-height: 100%; */
  line-height: 32px;
  font-size: 11px;
  top: 25%;
  z-index: 2;
}

.novrlive {
  height: 100%;
  background: #b9b7b7;
}

.quitMode {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99999991;
  background: rgba(0, 0, 0, 1);
}

.confirm {
  margin-top: 30px;
}
</style>
<style>
/* 竖屏底下的查询 */
@media screen and (orientation: portrait) {
  body {
    /* 防止页面被刘海遮住 */
    padding-top: constant(safe-area-inset-top);
    padding-top: 0px;
  }
}
/* 横屏底下的查询 */
@media screen and (orientation: landscape) {
  body {
    /* IOS 11支持*/
    padding-right: constant(safe-area-inset-right);
    padding-left: constant(safe-area-inset-left);
    padding-bottom: constant(safe-area-inset-bottom);
    /*IOS 11.2版本版本支持*/
    padding-right: env(safe-area-inset-right);
    padding-left: env(safe-area-inset-left);
    padding-bottom: env(safe-area-inset-bottom);
    padding-right: 0px;
    padding-left: 0px;
    padding-bottom: 0px;
  }
}
._toolBarArea {
  display: none !important;
}

.van-overlayCont .van-overlay {
  background-color: rgba(0, 0, 0, 0.3);
}

.el-scrollbar__bar.is-vertical {
  display: none;
}

#example > div {
  display: none !important;
}

.slide-fade-enter-active {
  transition: all 0.3s ease;
}

.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.van-overlay {
  z-index: 99 !important;
}

.slide-fade-enter,
  .slide-fade-leave-to

  /* .slide-fade-leave-active for below version 2.1.8 */
 {
  transform: translateX(10px);
  opacity: 0;
}

.videobox {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ddd;
}

.videobox video {
  width: 100%;
  height: 100%;
  background: #000000;
}

#videoboxcont {
  position: relative;
  width: 100%;
  height: auto;
}
.toolbar {
  position: fixed;
  right: 0;
  top: 40%;
  width: 12%;
  color: #fff;
  font-size: 13px;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: rgba(255, 255, 255, 1);
  z-index: 99;
}

.toolbar li {
  margin: 25px 0;
}

.toolbar img {
  width: 33px;
}

.quitLive {
  width: 277px;
  height: 192px;
  background: rgba(255, 251, 246, 1);
  box-shadow: 0px 6px 6px 0px rgba(20, 0, 0, 0.14);
  border-radius: 6px;
  padding: 20px;
  box-sizing: border-box;
}

.quitTitle {
  font-size: 24px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: rgba(211, 93, 87, 1);
  margin-bottom: 10px;
}

.quitwarning {
  margin-bottom: 35px;
  font-size: 16px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: rgba(111, 124, 142, 1);
}

.cancel {
  background: #2e4755ff;
  color: #fff;
  border-color: #2e4755ff;
  width: 40%;
  height: 36px;
  line-height: 36px;
  border-radius: 5px;
  margin: 0 15px;
}

.confirm {
  background: #d35e58ff;
  color: #fff;
  border-color: #d35e58ff;
  width: 40%;
  height: 36px;
  line-height: 36px;
  border-radius: 5px;
}

.liveinfosCont p {
  word-break: break-all;
}

.liveinfosCont {
  width: 315px;
  height: 309px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 6px;
  padding: 21px;
  box-sizing: border-box;
  overflow-y: auto;
  z-index: 99999999 !important;
}

.liveinfosCont::-webkit-scrollbar {
  display: none;
}
</style>


<style>
.videobox video::-webkit-media-controls-fullscreen-button {
  /* display: none; */
  position: absolute;
  left: 38px;
  z-index: 999;
}

.videobox
  video::-webkit-media-controls.sizing-small
  div[pseudo="-internal-media-controls-button-panel"i] {
}

.videobox video::-webkit-media-controls-timeline {
  display: none !important;
}

.videobox video::-webkit-media-controls-current-time-display {
  display: none !important;
}

.videobox video::-webkit-media-controls-time-remaining-display {
  /* display: none !important; */
}

.videobox video::-webkit-media-controls-mute-button {
  display: none !important;
}
.videobox video::-webkit-media-controls-play-button {
  /* display: none !important; */
}

.videobox video::-webkit-media-controls-toggle-closed-captions-button {
  display: none !important;
}
.videobox video::internal-media-controls-overflow-button {
  display: none !important;
}

.videobox video::-webkit-media-controls-volume-slider {
}
video::-webkit-media-controls {
  display: none !important;
}
</style>