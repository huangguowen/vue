/**
 * 菜单列表
 *
 */

import { axios } from '@/utils/request'

export function getPermissionList (parameter) {
  return axios({
    url: '/menu',
    method: 'get',
    params: parameter
  })
}

export function store (parameter) {
  return axios({
    url: '/menu',
    method: 'post',
    data: parameter
  })
}


export function read (id) {
  return axios({
    url: '/menu/' + id,
    method: 'get'
  })
}

export function update (id, parameter) {
  return axios({
    url: '/menu/' + id,
    method: 'put',
    data: parameter
  })
}

export function del (id) {
  return axios({
    url: '/menu/' + id,
    method: 'delete'
  })
}
//排序上下
export function sortUpdate (parameter) {
  return axios({
    url: '/menu/sort',
    method: 'post',
    data: parameter
  })
}
//操作列表
export function getFunctionList (parameter) {
  console.log(parameter)
  return axios({
    url: '/menu/function/',
    method: 'get',
    params:parameter
  })
}
//添加操作
export function functionAdd (parameter) {
  return axios({
    url: '/menu/functionAdd',
    method: 'post',
    data: parameter
  })
}
//更新操作
export function functionUpdate (id,parameter) {
  return axios({
    url: '/menu/functionUpdate/'+id,
    method: 'post',
    data: parameter
  })
}
//删除操作
export function functionDel (id) {
  return axios({
    url: '/menu/functionDel/' + id,
    method: 'delete'
  })
}
export function actionGetRoleList () {
  return axios({
    url: '/menu/actionGetRoleList',
    method: 'post'
  })
}

export function sortExchange(parameter) {
  return axios({
    url: '/menu/sortExchange',
    method: 'post',
    data: parameter
  })

}
export function switchFunction (id) {
  return axios({
    url: '/menu/switch/' + id,
    method: 'put'
  })
}
