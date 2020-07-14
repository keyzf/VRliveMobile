<template>
    <div class="hello">
        {{myPlayer}}
    </div>
</template>

<script>
    require("videojs-vr");
    export default {
        name: "TestTwo",
        data() {
            return {
                myPlayer: 1
            };
        },
        mounted() {
            eruda.init();
            this.initVideo();
        },
        methods: {
            initVideo() {
                //初始化视频方法
                var that = this;

                window.addEventListener('deviceorientation', that.myPlayernext, false);
                console.log(window)
                window.ondevicemotion = that.myPlayernext
            },
            myPlayernext(evet) {
                this.myPlayer++;
            }

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
    }

    canvas {
        left: 0 !important;
        width: 70%;
    }

    body {
        padding: 0;
        margin: 0;
    }
</style>