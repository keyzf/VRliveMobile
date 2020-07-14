<template>
  <div class=""
       style="background:rgba(224,226,227,1);height: 100%;">
    <div class="headerCont">
      <div style="height: 100%;">
        <van-row style=";"
                 type="flex"
                 justify="center">
          <van-col span="6">
            <van-image width="5rem"
                       height="5rem"
                       @click="$router.push('/')"
                       :src="userimg" />
          </van-col>
          <van-col span="9">
            <div class="userinfo">
              <p>{{userinfo.name}}</p>
              <p>{{userinfo.phone}}</p>
            </div>
          </van-col>
          <van-col span="8">
            <van-button type="default"
                        class="btn_FDA93BFF"
                        @click="quitShow=true">退出登录</van-button>
          </van-col>
        </van-row>
      </div>
    </div>
    <div style="    height: 406px;overflow-x: auto;">
      <div class="liveList">
        <div class="userinfolist">
          <div class="devList">
            <div class="titleCont">
              <span>可探视机位</span>
            </div>
            <div class="ilist">
              <ul>
                <li v-for="(item, index) in streamName"
                    :key="index">
                  <P>{{item}}</P>
                </li>

              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="liveList">
        <div class="userinfolist">
          <div class="devList">
            <div class="titleCont">
              <span>可探视时间</span>
            </div>
            <div class="ilist">
              <ul>
                <li v-for="(item, index) in periods"
                    :key="index">
                  <van-row type="flex"
                           justify="space-between">
                    <van-col span="7">
                      <P>{{item.start}}</P>
                    </van-col>
                    <van-col span="4">
                      <P>
                        <img style="width:100%"
                             src="../assets/img/icon1.png"
                             alt="">
                      </P>
                    </van-col>
                    <van-col span="7">
                      <P>{{item.end}}</P>
                    </van-col>
                  </van-row>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <dir style="height:20px"></dir>
    </div>
    <div class="quitMode"
         v-show="quitShow">
      <div class="quitLive">
        <p class="quitTitle">退出登录</p>
        <p class="quitwarning">确定退出登陆？</p>
        <div>
          <van-button class="cancel"
                      @click="quitShow=false"
                      type="default">取消</van-button>
          <van-button class="confirm"
                      @click="quitLoad"
                      type="default">确定</van-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      overlayshow: false,
      userimg: require('../assets/img/users.png'),
      quitShow: false,
      userinfo: {},
      periods: [],
      streamName: [],
      stream2dName: [],
    }
  },
  created () {
    this.handgetuserinfo()
  },
  mounted () {
    eruda.init();

  },
  methods: {
    handgetuserinfo () {
      this.axios.get('/lvms/api/user/info')
        .then(res => {
          this.userinfo = res.data.data;
          console.log(this.userinfo)
          this.periods = JSON.parse(this.userinfo.items[0].periods);
          var _this = this;
          this.userinfo.items.forEach((i, k) => {
            _this.streamName.push(i.name)
          })
        })
        .catch(err => {
          console.error(err);
        })
    },
    quitLoad () {
      this.removelocalStorage()
      this.$router.push({
        "name": "log"
      })
    },
    removelocalStorage () {
      localStorage.removeItem("authentication");
      localStorage.removeItem("curtime");
    },
    showinfos (row) {
      console.log(row)
      this.popupinfo = row;
      this.overlayshow = true;
    },
    onLoad () {
      this.list.push(this.list)
      this.finished = false;
      this.loading = false;
      this.listerror = true;
      // 异步更新数据
    }
  },
}
</script>

<style scoped>
.headerCont {
  width: 100%;
  height: 200px;
  background: url("../assets/img/headerBck.png");
  padding-bottom: 10%;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  position: relative;
  background-size: cover;
  background-position: bottom;
}
.userinfo p {
  height: 28px;
  font-size: 20px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: rgba(255, 255, 255, 1);
  line-height: 28px;
  text-align: left;
}

.headerCont .van-row--justify-center {
  align-items: center;
  position: absolute;
  bottom: 30px;
  width: 100%;
}

.btn_FDA93BFF {
  width: 96px;
  height: 30px;
  border-radius: 15px;
  border: 2px solid rgba(255, 255, 255, 1);
  background: transparent;
  font-size: 14px;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: rgba(255, 255, 255, 1);
  line-height: 27px;
}
.userinfolist {
  padding: 15px;
  padding-top: 45px;
}
.devList {
  position: relative;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 6px 6px 0px rgba(0, 0, 0, 0.14);
  border-radius: 4px;
}
.titleCont {
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
}
.titleCont span {
  display: inline-block;
  width: 99px;
  height: 30px;
  background: rgba(44, 72, 86, 1);
  box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.14);
  border-radius: 6px;
  color: #fff;
  line-height: 30px;
  box-sizing: border-box;
}
.ilist {
  padding-top: 15px;
}
.ilist ul {
  padding: 10px;
}
.ilist ul li {
  text-align: left;

  /* border-bottom: 1px dashed #dddddd; */
}
.ilist ul li::after {
  content: "";
  display: block;
  width: 100%;
  height: 1px;
  background-image: linear-gradient(
    to right,
    #ccc 0%,
    #ccc 80%,
    transparent 50%
  );
  background-size: 10px 1px;
  background-repeat: repeat-x;
}
.ilist ul li p {
  font-size: 16px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: rgba(44, 72, 86, 1);
  margin: 10px 0;
}
.ilist .van-row--justify-space-between {
  align-items: center;
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

  background: rgba(0, 0, 0, 0.2);
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
</style>
<style>
</style>