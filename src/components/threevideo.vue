<template>
    <div class="hello">

        <video id="myVideo" class="video-js vjs-big-play-centered" playsinline="true" webkitPlaysinline="true"
            controls="controls" preload="metadata" width="640" loop height="264" data-setup="{}"
            crossorigin="anonymous">
            <source :src="src" type="application/x-mpegURL">
        </video>
        <div class="R_Sidebar">
            <ul>
                <li>
                    <img src="../assets//img//8K@2x.png" alt="">
                </li>
                <li @click="V_mute">
                    <img v-if="volumecondition" src="../assets/img/volume-2@2x.png" alt="">
                    <img v-else src="../assets//img/volume-x@2x.png" alt="">
                </li>
                <li>
                    <img src="../assets//img/share-2@2x.png" @click="Sharacondition=true" alt="">
                </li>
            </ul>
        </div>
        <div class="B_Sidebar">
            <div class="tool_select" v-show="toolcondition">
                <ul>
                    <li v-for="(item, index) in vrlive" :key="index">
                        <p :class="{'activeLive':playVractive.id==item.id}">{{item.displayName}}</p>
                    </li>
                </ul>
            </div>
            <div class="tool_active" @click='toolChange'>
                <p>{{playVractive.displayName}}
                    <span v-if="toolcondition"><img src="../assets/img/top.png" alt=""></span>
                    <span v-else><img src="../assets/img/botttom.png" alt=""></span>
                </p>
            </div>
            <div class="SharaCont" v-show="Sharacondition" @click="Sharacondition=false">
                <img src="../assets//img/share.png" alt="">
            </div>
        </div>

        <div class="pwdCont" v-show="P_condition">
            <div class="pwdBack"> <img src="../assets//img/973f79d05091a32fc58c0489567757d.png" alt=""></div>
            <div style="position: relative;z-index: 9999;">
                <p class="pwdtitle">输入密码</p>
                <p class="pwdtinfo" style="margin-bottom:40px;" :class="{'P_error':errorType}">{{pwderror}}</p>
                <van-password-input :value="videopwd" :length="4" :gutter="20" :focused="showKeyboard"
                    @focus="onShowKey" />
            </div>
            <van-number-keyboard v-model="videopwd" :show="show" :length="4" theme="custom" extra-key="."
                close-button-text="完成" @blur="onblur" @input="onInput" @delete="onDelete" />
        </div>
    </div>
</template>

<script>
    // import 'videojs-contrib-hls'
    // require("videojs-vr");
    // require("videojs-contrib-hls");
    export default {
        name: "TestTwo",
        data() {
            return {
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
                loadcondition: false
            };
        },
        mounted() {
            eruda.init();
            var Rquery = this.$route.query;
            this.shareId = Rquery.shareId;
            if (Rquery.parameter == "true") {
                // console.log(21)
                this.P_condition = true;
            } else {
                this.P_condition = false;
                this.G_streamNopwd()

            }
        },
        methods: {
            G_streamNopwd() {
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
                            this.initVideo()
                        }
                    })
                    .catch(err => {
                        console.error(err);
                    })
            },
            G_stream(pwd) {
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
                            this.pwderror = '密码错误请重试';
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
                            this.initVideo()
                        }
                    })
                    .catch(err => {
                        console.error(err);
                    })
            },
            V_mute() {
                var video = document.getElementById('myVideo_html5_api');
                if (this.volumecondition) {
                    this.volumecondition = false
                    video.volume = 0;
                } else {
                    this.volumecondition = true
                    video.volume = 1;
                }
            },
            PlayVideo() {
                var videos = document.getElementById("myVideo_html5_api");
                videos.play()
                this.PlayIconCondition = false;
            },
            onblur() {
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
            onInput(value) {
                console.log(value)
            },
            onShowKey() {
                this.show = true
            },
            onDelete() {

            },
            toolChange() {
                if (this.toolcondition) {
                    this.toolcondition = false
                } else {
                    this.toolcondition = true
                }
            },
            pauses() {
                var box = document.getElementById("myVideo_html5_api");
                box.pause()
            },
            plays() {
                var box = document.getElementById("myVideo_html5_api");
                box.play()
            },
            initVideo() {
                var that = this;
                //初始化视频方法
                this.myPlayer = this.$video(myVideo, function () {
                    this.on('progress', function () {//客户端正在请求数据
                        console.log("客户端正在请求数据")
                    });
                });
                this.myPlayer.src({
                    src: "http://192.168.1.172:18085/live/live/C1_C1_hk1k/index.m3u8",
                    type: "application/x-mpegURL"
                })
                this.myPlayer.vr({ projection: '360' });

                if (this.myPlayer.mediainfo == undefined) {
                    this.myPlayer.mediainfo = {};
                }
                if (!this.myPlayer.mediainfo.projection) {
                    this.myPlayer.mediainfo.projection = '360';
                }
                // this.onclickPlay()
            },
            onclickPlay() {

                setTimeout(() => {
                    var videos = document.getElementById("myVideo_html5_api");
                    // console.log(videos)
                    videos.play()
                },
                    3000);
            },
            onClickLeft() {
                this.$router.push({ path: "/" });
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
        width: 70%;
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