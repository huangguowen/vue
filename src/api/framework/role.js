/**
 * 角色管理模块
 *
 */

import { axios } from '@/utils/request'

export function list(parameter) {
  return axios({
    url: '/role',
    method: 'get',
    params: parameter
  })
}

export function store(parameter) {
  return axios({
    url: '/role',
    method: 'post',
    data: parameter
  })
}

export function read(id) {
  return axios({
    url: '/role/' + id,
    method: 'get'
  })
}

export function update(id, parameter) {
  return axios({
    url: '/role/' + id,
    method: 'put',
    data: parameter
  })
}

export function del(id) {
  return axios({
    url: '/role/' + id,
    method: 'delete'
  })
}

export function get_all_menu_data() {
  return axios({
    url: '/role/getAllMenuData',
    method: 'post'
  })
}

export function get_assigned_menu_data(id) {
  return axios({
    url: '/role/getAssignedMenuData',
    data: {
      'id': id
    },
    method: 'post'
  })
}

export function save_assign_menu (id, parameter) {
  return axios({
    url: '/role/saveAssignMenu?id=' + id,
    method: 'post',
    data: parameter
  })
}

export function getRolesByUserId () {
    return axios({
        url: '/user/getRolesByUserId',
        method: 'get'
    })
}

export function swtichStatus (id) {
    return axios({
        url: '/role/swtichStatus/' + id,
        method: 'put',
    })
}
