import { axios } from '@/utils/request'

export function loginLogList (parameter) {
  return axios({
    url: '/log/login',
    method: 'get',
    params: parameter
  })
}

export function emptyLoginLog () {
  return axios({
    url: '/loginLog/empty',
    method: 'delete',
  })
}

export function operateLogList (parameter) {
  return axios({
    url: '/log',
    method: 'get',
    params: parameter
  })
}

export function read (id) {
  return axios({
    url: '/log/'+id,
    method: 'get'
  })
}
export function getCategoryList () {
  return axios({
    url: '/log/category',
    method: 'get'
  })

}
