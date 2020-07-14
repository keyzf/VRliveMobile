<template>
  <div style="padding:3%">
    <van-button type="primary"
                style="position: absolute;"
                @click="playkf">播放</van-button>

    <div ref="commel">
    </div>
  </div>
</template>

<script>
import CanvasKeyFrames from 'canvaskeyframes'
export default {
  data () {
    return {
      value1: "",
      value2: "",
      encrypted: "",
      decrypted: "",
      keyOne: '313233343536373a',
      SmokeExplosion: [
        // require("../assets/rocketAni_04/01.png"),
      ],
      kf: "",
      kfsrc: ""
    }
  },
  mounted () {
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
          imgarr[s] = imgs;
          console.log(s)
          if (s == 60) {
            _this.KeyFrame(imgarr)
          }
          s++;
        };
        imgs.src = element;
      })(index);
    }

  },
  methods: {
    pushimgs (urls) {
    },
    playkf () {
      this.kf.play();
    },
    KeyFrame (imgarr) {
      var el = this.$refs.commel
      var type = "array";
      var options = {
        fps: 60,
        loop: 1,
        width: 750 / 4,
        height: 1334 / 4
      }
      this.kf = new CanvasKeyFrames(el, type, imgarr, options)
    },
    encryptText () {
      var plain = this.value1;
      this.encrypted = this.jiami(plain);
    },
    decryText () {
      var plain = this.value2;
      this.decrypted = this.jiemi(plain);
      console.log(this.decrypted)
    },
    jiami (word) {
      var cryptoJs = this.$CryptoJS;
      let key = cryptoJs.enc.Hex.parse(this.keyOne)
      let enc = ''
      if (typeof word === 'string') {
        enc = cryptoJs.AES.encrypt(word, key, {
          // iv: iv
          mode: cryptoJs.mode.ECB,
          padding: cryptoJs.pad.Pkcs7
        })
      } else if (typeof word === 'object') {
        let data = JSON.stringify(word)
        enc = cryptoJs.AES.encrypt(data, key, {
          // iv: iv
          mode: cryptoJs.mode.CBC,
          padding: cryptoJs.pad.Pkcs7
        })
      }
      let encResult = enc.ciphertext.toString()
      return encResult
    },
    jiemi (word) {
      var cryptoJs = this.$CryptoJS;
      console.log('传入的密文：', word)
      let key = cryptoJs.enc.Hex.parse(this.keyOne)
      let dec = cryptoJs.AES.decrypt(cryptoJs.format.Hex.parse(word), key, {
        // vi: vi
        mode: cryptoJs.mode.ECB,
        padding: cryptoJs.pad.Pkcs7
      })
      let decData = cryptoJs.enc.Utf8.stringify(dec)
      return decData
    }
  },
}
</script>
<style >
body {
  background: url("../assets/img/973f79d05091a32fc58c0489567757d.png");
}
</style>