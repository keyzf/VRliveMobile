<template lang="">
  <div class="loginCont">
    <div>
      <van-image width="5rem" height="5rem" :src="userimg" />
      <div>
        <van-form @submit="onSubmit">
          <van-field v-model="phone" name="手机号登录" label="手机号登录" placeholder="请输入手机号"
            :rules="[{ required: true, message: '请填写正确的手机号' }]">
            <van-button slot="button" :disabled="phone.length!==11" v-show="codeShow" @click="sendcode" size="small"
              type="primary">发送验证码</van-button>
            <van-button slot="button" v-show="!codeShow" style="font-size:16px;" class="getCodeType" size="small"
              type="primary">{{count}} s
            </van-button>
          </van-field>
          <van-field v-model="code" @input="pwdChange" type="text" name="验证码" label="验证码" placeholder="请输入收到的验证码"
            :rules="[{ required: true, message: '请填写验证码' }]" />
          <div style="margin: 26px 0;">
            <div style="height: 20px;line-height: 20px;">
              <p class="logError" v-show="logError">{{logerror}}</p>
            </div>
            <van-button type="default" @click='onSubmit' native-type="submit" :disabled='logdisabled'
              class="loginsubmit  " :class="{'logdisabled':logdisabled}">登录</van-button>
          </div>
        </van-form>
      </div>
    </div>

  </div>
</template>
<script>
import JSEncrypt from 'jsencrypt';
import aes from '../assets/js/AESencrypt';

export default {
  components: {
  },
  data () {
    return {
      publicKey: "",
      logerror: "手机号或者验证码错误",
      logdisabled: true,
      userimg: require('../assets/img/users.png'),
      phone: '',
      code: '',
      codeShow: true,
      count: "",
      logError: false,
      key: ""
    }
  },
  mounted () {
  },
  methods: {
    setlocalStorage (authentication) {

      var curtime = new Date().getTime();
      var authentication = JSON.stringify(authentication)
      localStorage.setItem("authentication", authentication);
      localStorage.setItem("curtime", curtime);
    },

    onSubmit (values) {
      var loginstr = {
        phone: this.phone,
        code: this.code,
        aesKey: this.randomWord(false, 32)
      }
      this.publicKey = this.handrsaencrypt(JSON.stringify(loginstr))
      var params = {
        k: this.publicKey,
        phone: this.phone
      }
      this.axios.post("/lvms/api/user/webLogin", params)
        .then(res => {
          console.log(res)
          if (res.data.code !== 0) {
            this.logerror = res.data.msg;
            this.logError = true;
          } else {
            var key = "abcdefghtabcdefghtabcdefght"
            var authentication = {
              word: loginstr.aesKey,
              aesKey: aes.encryptText(loginstr.aesKey, key),
              key: key,
              token: res.data.data.token,
            }
            this.setlocalStorage(authentication);

            this.$router.push({ path: '/livelist' })
          }
        })
        .catch(err => {
          console.error(err);
        })
    },
    pwdChange (val) {
      console.log(this.code.length)
      this.code.length == 4 ? this.logdisabled = false : this.logdisabled = true;
    },
    randomWord (randomFlag, min, max) {
      var str = "",
        range = min,
        arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

      // 随机产生
      if (randomFlag) {
        range = Math.round(Math.random() * (max - min)) + min;
      }
      for (var i = 0; i < range; i++) {
        var pos = Math.round(Math.random() * (arr.length - 1));
        str += arr[pos];
      }
      return str;
    },
    handrsaencrypt (val) {
      console.log(val)
      var publicKey = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC5G+WuhAMgCAhoVa08iNTbBEw1bIKXXMhuqK7EofjAy2Ez8bIPrv1Rks7xkOZWfVnNRe1lU4+gQsxZbs60003n5ba2jyuYsqBMTKM6RRe0ujioCL4DOsU+BstsCWUlQgA5nE0C/JWnQkzo/hE10CpIAXyroJsELuq8tp8wSn7i7wIDAQAB";
      let jse = new JSEncrypt();
      jse.setPublicKey('-----BEGIN PUBLIC KEY-----' + publicKey + '-----END PUBLIC KEY-----');
      var str = jse.encrypt(val);
      return str
    },
    getCode () {
      const TIME_COUNT = 60;
      if (!this.timer) {
        this.count = TIME_COUNT;
        this.codeShow = false;
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= TIME_COUNT) {
            this.count--;
          } else {
            this.codeShow = true;
            clearInterval(this.timer);
            this.timer = null;
          }
        }, 1000)
      }
    },
    sendcode () {
      var phone = this.phone;
      var reg = /^1[3456789]\d{9}$/;
      console.log(reg.test(phone));
      if (!reg.test(phone)) {

        this.logError = true
        return false;
      }
      this.logError = false
      this.getCode();
      this.axios.post('/lvms/api/user/genSms?phone=' + this.phone)
        .then(res => {
          console.log(res)
          if (res.data.code !== 0) {
            this.logerror = res.data.msg;
            this.logError = true
          } else {
            this.logError = false
          }
        })
        .catch(err => {
          console.error(err);
        })
      //验证码的时间设置 可有可无
      //手机号争取后调取接口
    },

  },
}
</script>
<style scoped>
.loginCont {
  background: url("../assets/img/log_back.png");
  background-size: 100%;
  background-position: bottom;
  width: 100%;
  height: 100%;
}

.loginCont > div {
  padding: 10% 4%;
}

.loginCont .van-cell {
  background: transparent;
  display: block;
  padding: 0;
  margin-bottom: 10px;
}

.loginCont .van-cell:not(:last-child)::after {
  border-bottom: none;
}

#app .loginCont .logdisabled {
  background-color: #e0e2e3ff;
  border-color: #e0e2e3ff;
}

.logError {
  font-size: 13px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: rgba(211, 93, 87, 1);
}

.loginCont .van-field__body .getCodeType {
  background-color: #dfe1e5ff;
  border-color: #dfe1e5ff;
}
</style>
<style>
.loginCont .van-field__label {
  font-size: 14px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: rgba(255, 255, 255, 1);
  text-align: left;
  height: 40px;
  line-height: 40px;
}

.loginCont .van-field__body .van-button--small {
  background: #fda93bff;
  border: #fda93bff;
  height: 44px;
  width: 80px;
}

.loginCont .van-field__body {
  background: #fdffffff;
  display: block;
  border-radius: 3px;

  box-sizing: border-box;
}

.loginCont .van-field__body .van-field__button {
  position: absolute;
  right: 3px;
  top: 3px;
}

.loginCont .van-field__control {
  background: #fdffffff;
  height: 50px;
  font-size: 18px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: rgba(44, 72, 86, 1);
  line-height: 50px;
  border-radius: 3px;
  border: 2px solid transparent;
  box-sizing: border-box;
  width: 100%;
  vertical-align: bottom;
  padding: 0 10px;
  user-select: text;
  -webkit-user-select: text;
}

#app .loginsubmit {
  background: #fdab3aff;
  border-color: #fdab3aff;
  width: 167px;
  height: 46px;
  border-radius: 3px;
  font-size: 16px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: rgba(255, 255, 255, 1);
  margin-top: 10px;
  opacity: 1;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.27);
}

.loginCont .van-field__control:focus {
  border: 2px solid rgba(253, 172, 58, 1);
  background: #fff;
}

.loginCont .van-field__body .van-button--disabled {
  background: #ddd;
}
</style>