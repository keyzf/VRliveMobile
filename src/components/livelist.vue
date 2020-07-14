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
                       :src="userimg" />
          </van-col>
          <van-col span="9">
            <div class="userinfo">
              <p>{{userinfo.name}}</p>
            </div>
          </van-col>
          <van-col span="8">
            <van-button @click="touserinfo"
                        type="default"
                        class="btn_FDA93BFF">用户中心</van-button>
          </van-col>
        </van-row>
      </div>
    </div>
    <div>
      <el-scrollbar style="height:500px">
        <van-pull-refresh v-model="isLoading"
                          success-text="刷新成功"
                          @refresh="onRefresh">
          <div class="liveList">
            <h3>直播间列表</h3>
            <div class="listcont">
              <van-list>
                <div v-for="(item,index) in list"
                     class="listitems"
                     :key="index">
                  <van-row type="flex"
                           justify="center">
                    <van-col span="12">
                      <div style="background-color: #698e97;    position: relative;">
                        <div @click="tolive(item)"
                             :style="{background: 'url(' + item.cover + ') center center', backgroundSize: '100%'}"
                             class="livecover">
                          <img src="../assets//img//tohome.png"
                               style="width: 30px;"
                               alt="">
                          <div class="camearnum">
                            <img src="../assets/img/3G@2x.png"
                                 alt="">
                            <span>{{item.streamCount}}</span>
                          </div>
                        </div>
                      </div>
                    </van-col>
                    <van-col span="12">
                      <div>
                        <div class="listinfo"
                             style="overflow:hidden"
                             @click="showinfos(item)">
                          <p>{{item.name}}</p>
                          <p style=" word-break: break-all;">{{item.desc.substring(0,30)}}</p>
                        </div>
                      </div>
                    </van-col>
                  </van-row>
                </div>
              </van-list>
              <p v-if="listerror">{{errorTxt}}</p>
            </div>
            <div style="height:80px">
            </div>
          </div>
        </van-pull-refresh>
      </el-scrollbar>
    </div>
    <div>
      <van-popup v-model="overlayshow"
                 class="popupcont">
        <div class="liveinfosCont">
          <div style="text-align: right;color:#fff">
            <van-icon name="cross"
                      @click="overlayshow = false" />
          </div>
          <div>
            <div class="liveinfos">
              <h3>{{popupinfo.name}}(ID:{{setids(popupinfo.id)}})</h3>
              <p>
                直播简介： {{popupinfo.desc}}
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
  </div>
</template>
<script>
import aes from '../assets/js/AESencrypt';
export default {
  data () {
    return {
      overlayshow: false,
      userimg: require('../assets/img/users.png'),
      imgslot: require('../assets/img/listimg.png'),
      list: [

      ],
      liveinfo: {},
      loading: false,
      popupinfo: {},
      finished: false,
      listerror: false,
      userinfo: {},
      count: "",
      isLoading: false,
      errorTxt: ""
    }
  },
  created () {

  },
  mounted () {

    // eruda.init();
    this.handgetuserinfo()
  },
  methods: {
    onRefresh () {
      this.handgetuserinfo()
    },
    handgetuserinfo () {
      this.axios.get('/lvms/api/user/info')
        .then(res => {
          this.userinfo = res.data.data;
          if (this.userinfo.items == undefined) {
            this.listerror = true;
            this.errorTxt = "暂无直播内容"
            this.isLoading = false;
            return false
          }
          var periods = this.userinfo.items[0].periods;
          var canplay = false;
          var time = JSON.parse(periods);
          if (time.length == 0) {
            canplay = true
          } else {
            time.forEach(element => {
              var times = this.handcanplay(element);
              if (times == true) {
                canplay = true;
              }
            });
          }
          if (canplay == true) {
            this.handgetlivelist()
            this.listerror = false;
          } else {
            this.listerror = true;
            this.list = []
            this.errorTxt = "当前时间段不可探视，请联系运营人员处理"
            this.isLoading = false;
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
    handcanplay (periods) {
      var time = periods;
      var nowTime = this.$moment().format("YYYY-MM-DD HH:mm:ss");
      var startTime = time.start;
      var endTime = time.end;
      var istime;
      istime = this.$moment(nowTime).isBetween(startTime, endTime);
      return istime;
    },
    handgetlivelist () {
      this.list = []
      this.axios.get("/lvms/api/room")
        .then(res => {
          var data = res.data.data.items;
          for (var a = 0; a < data.length; a++) {
            if (data[a].status !== 0) {
              this.list.push(data[a])
            }
          }
          if (this.list.length !== 0) {
            this.isLoading = false;
          }
        })
        .catch(err => {
          console.error(err);
        })
    },
    touserinfo () {
      var userinfo = JSON.stringify(this.userinfo)
      this.$router.push({ path: '/userinfo', query: { userinfo: userinfo } })
    },
    tolive (itme) {
      var vid = itme.id
      this.$router.push({ path: '/live', query: { vid: vid } })
    },
    showinfos (row) {
      this.popupinfo = row;
      this.overlayshow = true;
    },
    onLoad () {
      this.handgetuserinfo()
      // this.list.push(this.list)
      // this.loading = false;
      // this.listerror = false;
      // 异步更新数据
    }
  },
}
</script>

<style scoped>
.popupcont {
  background: transparent;
}
.liveinfosCont {
  width: 315px;
  height: 309px;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 6px;
  padding: 21px;
  box-sizing: border-box;
  overflow-y: auto !important;
  z-index: 99999999 !important;
}
.liveinfosCont p {
  word-break: break-all;
}
.liveinfos {
  text-align: left;
  margin-bottom: 27px;
}
.liveinfos p {
  word-break: break-all;
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
.wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  height: 100%;
  padding: 15px;
  box-sizing: border-box;
}

.listitems div {
  height: 100%;
}

.listitems .watch img {
  margin-right: 5px;
}

.listitems .watch {
  position: absolute;
  bottom: 0;
  height: 20px;
  right: 10px;
  font-size: 11px;
  line-height: 20px;
  color: #fff;
}

.listinfo p {
  text-align: left;
  padding-left: 15px;
  font-size: 14px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: rgba(44, 72, 86, 1);
  line-height: 20px;
}

.listinfo p:first-child {
  margin-bottom: 13px;
  font-size: 16px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: rgba(44, 72, 86, 1);
}

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
  font-size: 30px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: rgba(255, 255, 255, 1);
}
.livecover .camearnum {
  position: absolute;
  bottom: 5px;
  height: 25px !important;
  right: 9px;
  line-height: 25px;
}
.camearnum img {
  width: 18px;
}
.camearnum span {
  font-size: 16px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: rgba(255, 255, 255, 1);
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

.liveList {
  padding: 0 20px;
}

.listcont {
  box-sizing: border-box;
  min-height: calc(100vh - 56px);
  padding-bottom: 20px;
}

.van-list {
  width: 100%;
}

.liveList h3 {
  font-size: 16px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: rgba(44, 72, 86, 1);
  text-align: left;
}

.listitems {
  height: 130px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 6px 6px 0px rgba(0, 0, 0, 0.14);
  border-radius: 6px;
  padding: 5px;
  margin-bottom: 10px;
  box-sizing: border-box;
}
</style>
<style>
.el-scrollbar__bar.is-vertical > div,
.el-scrollbar__bar.is-vertical {
  display: none !important;
}
.livecover {
  background: url("../assets/img/livelist.png");
  border-radius: 5px;
  position: relative;
  background-size: 100% 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.liveinfosCont {
  width: 315px;
  height: 309px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 6px;
  padding: 21px;
  box-sizing: border-box;
  overflow-y: auto;
}

.liveinfosCont::-webkit-scrollbar {
  display: none;
}
.eruda-container .eruda-entry-btn {
  touch-action: none;
  left: 361px;
  z-index: 99999999;
  top: 10%;
  opacity: 1;
}
</style>