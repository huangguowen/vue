/**
 * export component map
 */
export default {

    //系统组件
    userLayout: () => import('@/layouts/UserLayout'),
    basicLayout: () => import('@/layouts/BasicLayout'),
    routeView: () => import('@/layouts/RouteView'),
    blankLayout: () => import('@/layouts/BlankLayout'),
    pageView: () => import('@/layouts/PageView'),

    //框架组件
    menu:()=>import('@/views/framework/menu/index'),
    role: () => import('@/views/framework/role/index'),
    unit: () => import('@/views/framework/unit/index'),
    user: () => import('@/views/framework/user/index'),
    log: () => import('@/views/framework/log/index'),
    dashboard: () => import('@/views/framework/dashboard/index'),
    profile: () => import('@/views/framework/general/profile/index'),
    help: () => import('@/views/framework/general/help/index'),
    modifyPassword: () => import('@/views/framework/basic/modifyPassword'),
    file: () => import('@/views/framework/file/index'),
    dict: () => import('@/views/framework/dict/cate'),
    dictlist: () => import('@/views/framework/dict/list'),

    //业务组件
    student: () => import('@/views/example/student/index'),


}
