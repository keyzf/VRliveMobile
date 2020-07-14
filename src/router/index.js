import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import HelloWorldcopy from '@/components/HelloWorld copy'
import deviceorientation from '@/components/deviceorientation';
import log from '@/components/log';
import livelist from '@/components/livelist';
import userinfo from '@/components/userinfo';
import live from '@/components/live';
import encrypt from '@/components/encrypt';

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/deviceorientation',
      name: 'deviceorientation',
      component: deviceorientation
    },
    {
      path: '/Iosvrlive',
      name: 'Iosvrlive',
      component: HelloWorld,
      meta: {

        allowBack: false
      }
    },
    {
      path: '/',
      name: 'livelist',
      component: livelist,
    },
    {
      path: '/log',
      name: 'log',
      component: log,
    },
    {
      path: '/livelist',
      name: 'livelist',
      component: livelist,
    },
    {
      path: '/userinfo',
      name: 'userinfo',
      component: userinfo,
    },
    {
      path: '/live',
      name: 'live',
      component: live
    }
    ,
    {
      path: '/encrypt',
      name: 'encrypt',
      component: encrypt
    }
  ]

})
