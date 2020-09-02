/**
 * 文件管理上传
 *
 */

import { axios } from '@/utils/request'

export function list(parameter) {
    return axios({
        url: '/unit',
        method: 'get',
        params: parameter
    })
}

export function store(parameter) {
    return axios({
        url: '/unit',
        method: 'post',
        data: parameter
    })
}

export function read(id) {
    return axios({
        url: '/unit/' + id,
        method: 'get'
    })
}

export function update(id, parameter) {
    return axios({
        url: '/unit/' + id,
        method: 'put',
        data: parameter
    })
}

export function del(id) {
    return axios({
        url: '/unit/' + id,
        method: 'delete'
    })
}