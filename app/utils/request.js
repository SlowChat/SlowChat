import { Platform } from 'react-native'
import URL from './url'

const BASE_URL = 'http://manyou.0lz.net/'

const getToken = () => {
  return '217aba3196c7dd24f2a0a39c7dff4da2217aba3196c7dd24f2a0a39c7dff4da2'
}

export function get(url, params) {
  const geturl = URL.stringify(BASE_URL + url, params)
  return fetch(geturl, {
    method: 'GET',
    headers: {
      'MY-Token': getToken(),
      'MY-Device-Type': Platform.OS == 'ios' ? 'iphone' : 'android'
    },
  }).then((response) => {
    if (response.ok) {
      return response.json();
    }
  })
}


export function post(url, params) {
  console.log(params);
  return fetch(BASE_URL + url, {
    method: 'POST',
    headers: {
      // 'Content-Type': 'application/x-www-form-urlencoded',
      'MY-Token': getToken(),
      'MY-Device-Type': Platform.OS == 'ios' ? 'iphone' : 'android'
    },
    body: JSON.stringify(params),
  }).then((response) => response.json()).catch((err) => {
    console.error(err);
    throw err
  });
}


export function upload(uri) {
  let formData = new FormData();
  const name = file.substring(file.lastIndexOf('/') + 1, file.length)
  let file = {uri: uri, type: 'multipart/form-data', name: name};
  formData.append('file', file);
  return fetch(BASE_URL + 'api/upload/image.html', {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
      'MY-Token': getToken(),
      'MY-Device-Type': Platform.OS == 'ios' ? 'iphone' : 'android'
    },
    body: params,
  }).then((response) => {
    return response.text()
  })
}

// {
//   "code": 1,
//   "msg": "上传成功",
//   "data": [
//     "url":"",
//     "filename":"20180801\f659c44c9594190f809cd5f9157a08cc.jpg"
//   ]
// }
