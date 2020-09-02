/**
 * 用户管理模块
 *
 */

import { axios } from '@/utils/request'

export function getUserList (parameter) {
  return axios({
    url: '/user',
    method: 'get',
    params: parameter
  })
}

export function store (parameter) {
  return axios({
    url: '/user',
    method: 'post',
    data: parameter
  })
}

export function read (id) {
  return axios({
    url: '/user/' + id,
    method: 'get'
  })
}

export function update (id, parameter) {
  return axios({
    url: '/user/' + id,
    method: 'put',
    data: parameter
  })
}

export function del (id) {
  return axios({
    url: '/user/' + id,
    method: 'delete'
  })
}

export function swtichStatus (id) {
  return axios({
    url: '/user/switch/status/' + id,
    method: 'put'
  })
}

export function updatePass (id, parameter) {
    return axios({
        url: '/user/updatePassword/' + id,
        method: 'post',
        data: parameter
    })
}

export function modifyPassword (parameter) {
    return axios({
        url: '/basic/modifyPassword',
        method: 'post',
        data: parameter
    })
}

//个人中心修改
export function updateProfile (parameter) {
    return axios({
        url: '/basic/updateProfile',
        method: 'post',
        data: parameter
    })
}

//获取个人中心数据
export function getProfile (parameter) {
    return axios({
        url: '/basic/getProfile',
        method: 'get',
        data: parameter
    })
}
