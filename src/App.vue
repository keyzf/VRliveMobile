<template>
  <div id="app">
    <router-view />
  </div>

</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      shareId: ""
    }
  },
  mounted () {
    var Rquery = this.$route.query;
    var Pcis = this.IsPC();
    this.shareId = Rquery.shareId;
    // if (Pcis) {
    //   var href = this.serverConfig.Pcurl + '?shareId=' + this.shareId + '&parameter=' + Rquery.parameter;
    //   window.location = href;
    // } else {
    // }
  },
  methods: {
    IsPC () {
      var userAgentInfo = navigator.userAgent;
      var Agents = ['Android', 'iPhone',
        'SymbianOS', 'Windows Phone',
        'iPad', 'iPod'
      ];
      var flag = true;
      for (var i = 0; i < Agents.length; i++) {
        if (userAgentInfo.indexOf(Agents[i]) != -1) {
          flag = false;
          break;
        }
      }
      return flag;
    },
  },
}
</script>

<style>
* {
  -webkit-touch-callout: none; /*系统默认菜单被禁用*/
  -webkit-user-select: none; /*webkit浏览器*/
  -khtml-user-select: none; /*早期浏览器*/
  -moz-user-select: none; /*火狐*/
  -ms-user-select: none; /*IE10*/
  user-select: none;
}
body,
html {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

body,
html,
div {
  margin: 0;
  padding: 0;
}

#app {
  width: 100%;
  height: 100%;
}

p {
  margin: 0;
}

ul,
li {
  padding: 0;
  margin: 0;
  list-style: none;
}

br {
  font-size: 0;
  height: 0;
}

body,
#app .el-header {
  margin: 0;
  padding: 0;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.hello {
  height: 100%;
}

.bottomnav {
  position: fixed;
  width: 100%;
  bottom: 0;
  box-shadow: 1px 1px 4px #ada3a3;
}

.van-grid-item__content {
  padding: 4px 8px;
}
.van-overlay {
  background-color: transparent !important ;
}
</style>