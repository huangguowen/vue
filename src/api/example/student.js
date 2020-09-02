/**
 * 学生模块
 *
 */

import { axios } from '@/utils/request'

export function getStudentList (parameter) {
  return axios({
    url: '/student',
    method: 'get',
    params: parameter
  })
}

export function store (parameter) {
  return axios({
    url: '/student',
    method: 'post',
    data: parameter
  })
}

export function read (id) {
  return axios({
    url: '/student/' + id,
    method: 'get'
  })
}

export function update (id, parameter) {
  return axios({
    url: '/student/' + id,
    method: 'put',
    data: parameter
  })
}

export function del (id) {
  return axios({
    url: '/student/' + id,
    method: 'delete'
  })
}
