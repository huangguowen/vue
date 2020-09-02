/**
 * 菜单列表
 *
 */

import { axios } from '@/utils/request'

export function getPermissionList (parameter) {
  return axios({
    url: '/dict',
    method: 'get',
    params: parameter
  })
}

export function store (parameter) {
  return axios({
    url: '/dict',
    method: 'post',
    data: parameter
  })
}


export function read (id) {
  return axios({
    url: '/dict/' + id,
    method: 'get'
  })
}

export function update (id, parameter) {
  return axios({
    url: '/dict/' + id,
    method: 'put',
    data: parameter
  })
}

export function del (id) {
  return axios({
    url: '/dict/' + id,
    method: 'delete'
  })
}
//排序上下
export function sortUpdate (parameter) {
  return axios({
    url: '/dict/sort',
    method: 'post',
    data: parameter
  })
}


export function sortExchange(parameter) {
  return axios({
    url: '/dict/sortExchange',
    method: 'post',
    data: parameter
  })

}

