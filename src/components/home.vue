<template>

  <div class="hello">
    <van-nav-bar title="直播室列表"
                 :fixed="true" />
    <div style="margin-top: 46px;;padding: 15px;box-sizing: border-box;">
      <div v-for="(item,index) in list"
           :key="index"
           class="listimg"
           style="height:200px;">
        <div class="itminfo"
             :style="{backgroundImage: 'url(' + item.cover + ')',height:'100%',backgroundSize:'100% 100%'}">
          <div class="vrtag"
               v-if="item.status">
            <van-tag type="success">正在直播</van-tag>
          </div>
          <div class="vrtag"
               v-else>
            <van-tag type="danger">暂未直播</van-tag>
          </div>
          <div style="display: block;">
            <p>{{item.displayName}}</p>

            <template>
              <p class="toplayvr"
                 @click="tovrhome(item)">
                进入直播
              </p>
            </template>

          </div>

        </div>
      </div>
    </div>
    <van-dialog v-model="show"
                title="请输入密码"
                show-cancel-button
                @confirm="tovrhomeconfirm">
      <div style="padding: 15px;">
        <van-cell-group>
          <van-field v-model="vrpwd"
                     placeholder="请输入密码" />
        </van-cell-group>
      </div>
    </van-dialog>
  </div>
  </div>
</template>

<script>
import { Toast } from 'vant';

export default {
  name: "TestTwo",
  data () {
    return {
      row: "",
      vrpwd: "",
      show: false,
      list: [

      ],
      loading: false,
      finished: true
    };
  },
  mounted () {
    this.geivideovrlist()
  },
  methods: {
    onLoad () {

    },
    onClickRight () { },
    tovrhome (lock) {
      console.log(this.$Global)
      this.$Global.videoinfo = lock
      this.$router.push({ path: '/live' })
    },
    tovrhomeconfirm () {
      Toast.fail('密码错误');
    },
    geivideovrlist () {
      var params = {
        type: "vr",
        code: "hk1k",
        shareId: ""
      }
      this.axios.get("/lvms/api/stream", {
        params: params
      })
        .then(res => {
          console.log(res)
          this.list = res.data.data.items
        })
        .catch(err => {
          console.error(err);
        })
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.listimg {
  position: relative;
  width: 100%;
  margin-bottom: 10px;
  padding: 8px;
  box-sizing: border-box;
  box-shadow: 0 1px 4px #4e4141;
  border-radius: 5px;
}

.listimg img {
  width: 100%;
}

.hello {
  overflow-y: auto;
}

.itminfo {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 20px;
}

.itminfo p {
  display: block;
}

.vrtag {
  position: absolute;
  top: 5%;
  right: 3%;
}

.toplayvr {
  margin: 15px 0;
  color: #009688;
  cursor: pointer;
}

.listimg img.lock {
  width: 19px;
  height: 19px;
  display: inline-block;
  vertical-align: text-top;
  margin: 0 5px;
}
</style>