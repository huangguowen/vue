import Vue from 'vue'
import router from './router'
import store from './store'

import NProgress from 'nprogress' // progress bar
import '@/components/NProgress/nprogress.less' // progress bar custom style
import notification from 'ant-design-vue/es/notification'
import { setDocumentTitle, domTitle } from '@/utils/domUtil'
import { ACCESS_TOKEN } from '@/store/mutation-types'
const whiteList = ['login', 'register', 'registerResult'] // no redirect whitelist

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const defaultRoutePath = '/dashboard/index'

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  to.meta && (typeof to.meta.title !== 'undefined' && setDocumentTitle(`${to.meta.title} - ${domTitle}`))
  if (Vue.ls.get(ACCESS_TOKEN)) {
    /* 登陆后 如果进入登陆页面 重定向到首页 */
    if (to.path === '/login/index') {
      next({ path: defaultRoutePath })
      NProgress.done()
    } else {
        // 如果没有获取到角色 再次获取用户信息
      if (store.getters.roles.length === 0) {
          // store dispatch 经过 action 一节概念：https://vuex.vuejs.org/zh/guide/actions.html
        store.dispatch('GetInfo')
          .then(res => {
              // GetInfo 方法会将接口的返回数据 resolve 过来, 具体可查看 Promise 概念
            const permissions = res.data && res.data.permissions
            store.dispatch('GenerateRoutes', { permissions }).then(() => {
              // 根据roles权限生成可访问的路由表
              // 动态添加可访问路由表
              router.addRoutes(store.getters.addRouters)
              const redirect = decodeURIComponent(from.query.redirect || to.path)
              console.log(redirect)
              console.log(to.path)
              if (to.path === redirect) {
                  // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
                next({ ...to, replace: true })
              } else {
                // 跳转到目的路由
               /* next({ path: redirect })*/
                next({ path: to.path })
              }
            })
          })
          .catch(() => {
            notification.error({
              message: '错误',
              description: '请求用户信息失败，请重试'
            })
            store.dispatch('Logout').then(() => {
              next({ path: '/login/index', query: { redirect: to.fullPath } })
            })
          })
      } else {
        next()
      }
    }
  } else {
    if (whiteList.includes(to.name)) {
      // 在免登录白名单，直接进入
      next()
    } else {
      next({ path: '/login/index', query: { redirect: to.fullPath } })
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
