import { asyncRouterMap, constantRouterMap } from '@/config/router.config'
import components from '@/config/componentsMap'

/**
 * 单账户多角色时，使用该方法可过滤角色不存在的菜单
 *
 * @param roles
 * @param route
 * @returns {*}
 */
// eslint-disable-next-line
function hasRole(roles, route) {
  if (route.meta && route.meta.roles) {
    return route.meta.roles.includes(roles.id)
  } else {
    return true
  }
}

function treePermissions (permissions, $pid = 0) {
  let routes = []
  for (const permission of permissions) {
    if ($pid == permission.parent_id) {
        let p = {};
        p.path = permission.route
        p.name = permission.component
        if (permission.redirect) {
          p.redirect = permission.redirect
        }
        p.component = components[permission.component]
        p.meta = {}
        p.meta.title = permission.title
        p.meta.icon = permission.icon
        if (permission.keepalive === 1) {
          p.meta.keepAlive = true
        }
        p.meta.hidden = permission.is_expand === 1 ? false : true
        const children = treePermissions(permissions, permission.id)
       if (children.length) {
        p.children = children
       }
       routes.push(p)
    }
  }
  return routes
}

function filterThenGetMenus (permissions) {
   const menus = [];
   for (const permission of permissions) {
     if (permission.type === 1) {
       menus.push(permission)
     }
   }
   return menus
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes ({ commit }, data) {
      return new Promise(resolve => {
        const { permissions } = data
        asyncRouterMap[0].children = treePermissions(filterThenGetMenus(permissions))
        commit('SET_ROUTERS', asyncRouterMap)
        resolve()
      })
    },
    GetLatestRoutes ({commit}, data) {
      const { permissions } = data
      asyncRouterMap[0].children = treePermissions(filterThenGetMenus(permissions))
      commit('SET_ROUTERS', asyncRouterMap)
    }
  }
}

export default permission
