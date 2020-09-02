/**
 * 字典管理
 *
 */

import { axios } from '@/utils/request'

export function list(parameter) {
  return axios({
    url: '/dict/list',
    method: 'get',
    params: parameter
  })
}

export function store(parameter) {
  return axios({
    url: '/dict',
    method: 'post',
    data: parameter
  })
}

export function read(id) {
  return axios({
    url: '/dict/' + id,
    method: 'get',
    params: {type:2}
  })
}

export function getCategory() {
  return axios({
    url: '/dict',
    method: 'get',
    params: {type:'treeSelect'}
  })
}

export function update(id, parameter) {
  return axios({
    url: '/dict/' + id,
    method: 'put',
    data: parameter
  })
}

export function del(id) {
  return axios({
    url: '/dict/' + id,
    method: 'delete',
    params: {type:2}
  })
}

export function swtichStatus (id) {
  return axios({
    url: '/dict/switch/status/' + id,
    method: 'put'
  })
}

export function listSort (parameter) {
  return axios({
    url: '/dict/listSort',
    method: 'put',
    data: parameter
  })
}

export function updateDic(id, parameter) {
  return axios({
    url: '/dictdata/update/' + id,
    method: 'post',
    data: parameter
  })
}

export function addDic(parameter) {
  return axios({
    url: '/dictdata/save',
    method: 'post',
    data: parameter
  })
}

export function dictDataIndex(parameter) {
  return axios({
    url: '/dictdata',
    method: 'get',
    params: parameter
  })
}

export function dictDataRead(id) {
  return axios({
    url: '/dictdata/read/' + id,
    method: 'get',
  })
}

export function dictDataDel(id) {
  return axios({
    url: '/dictdata/' + id,
    method: 'delete',
  })
}