import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      component: () => import('@/components/Login')
    },
    {
      path: '/monitor',
      component: () => import('@/components/Monitor')
    },
    {
      path: '/',
      component: () => import('@/components/Main'),
      children: [{
        path: 'portal',
        component: () => import('@/components/Portal')
      }, {
        path: 'portaldevicelist',
        component: () => import('@/components/PortalDeviceList')
      }, {
        path: 'portalmap',
        component: () => import('@/components/PortalMap')
      }, {
        path: 'error403',
        component: () => import('@/components/Error403')
      }, {
        path: 'userchangepassword',
        component: () => import('@/components/DataItem/sys_user_changepassword')
      }, {
        path: 'datalist/:datatype',
        component: () => import('@/components/DataList')
      },
      {
        path: 'dataitem/:data_type/:data_action/:data_id',
        component: () => import('@/components/DataItem'),
        props: true
      }, {
        path: 'influx',
        component: () => import('@/components/QueryInflux')
      },
      {
        path: '*',
        redirect: '/monitor'
      }
      ]
    }
  ]
})
