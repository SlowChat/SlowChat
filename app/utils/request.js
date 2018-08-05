import { Platform } from 'react-native'
import Constant from './constant'
import Storage from './storage'

import URL from './url'

const BASE_URL = Constant.DOMAIN + '/'

const getToken = () => {
  return '217aba3196c7dd24f2a0a39c7dff4da2217aba3196c7dd24f2a0a39c7dff4da2'
}

const getHeaders = async (unneed) => {
  if (unneed) {
    return {}
  }
  return {
<<<<<<< HEAD
    'Content-Type': 'application/json',
    'MY-Token': getToken(),
=======
    // 'Content-Type': 'application/x-www-form-urlencoded',
    'MY-Token': await Storage.getToken(),
>>>>>>> 97b91fdb0b411ac7cbc2414a26d5f01190f89847
    'MY-Device-Type': Platform.OS == 'ios' ? 'iphone' : 'android'
  }
}

export async function get(url, params, unneedLogin) {
  const geturl = URL.stringify(BASE_URL + url, params)
  const headers = await getHeaders(unneedLogin)
  return fetch(geturl, {
    method: 'GET',
    headers
  }).then((response) => {
    if (response.ok) {
      return response.json();
    }
  })
}


<<<<<<< HEAD
export function post(url, params, unneedLogin) {
  console.log('----', params)
=======
export async function post(url, params, unneedLogin) {
  const headers = await getHeaders(unneedLogin)
>>>>>>> 97b91fdb0b411ac7cbc2414a26d5f01190f89847
  return fetch(BASE_URL + url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify(params),
  }).then((response) => response.json()).catch((err) => {
    console.error(err);
    throw err
  });
}


export async function upload(uri) {
  let formData = new FormData();
  const name = uri.substring(uri.lastIndexOf('/') + 1, uri.length)
  let file = {uri: uri, type: 'multipart/form-data', name: name};
  formData.append('file', file);
  const headers = await getHeaders(unneedLogin)
  return fetch(BASE_URL + 'api/upload/image.html', {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
      ...headers
    },
    body: formData,
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
