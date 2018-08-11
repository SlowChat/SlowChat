import { Platform } from 'react-native'
import Constant from './constant'
import Storage from './storage'
import URL from './url'

const BASE_URL = Constant.DOMAIN + '/'


const getHeaders = async (unneed) => {
  if (unneed) {
    return {}
  }
  const token = await Storage.getToken()
  return {
    // 'Content-Type': 'application/x-www-form-urlencoded',
    'MY-Token': await Storage.getToken(),
    'MY-Device-Type': Platform.OS == 'ios' ? 'iphone' : 'android'
  }
}
// 'Content-Type': 'application/x-www-form-urlencoded',

export async function get(url, params, unneedLogin) {
  const geturl = URL.stringify(BASE_URL + url, params)
  const headers = await getHeaders(unneedLogin)
  return fetch(geturl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  }).then((response) => response.json()).catch((err) => {
    console.error(eval("("+ err +")"));
    throw err
  });
}

export async function post(url, params, unneedLogin) {
  const headers = await getHeaders(unneedLogin)
  console.log(url)
  console.log(params)
  console.log(headers);
  return fetch(BASE_URL + url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify(params),
  }).then((response) => response.json()).catch((err) => {
    console.error(eval("("+ err +")"));
    throw err
  });
}


export async function upload(uri) {
  let formData = new FormData();
  const name = uri.substring(uri.lastIndexOf('/') + 1, uri.length)
  let file = {uri: uri, type: 'multipart/form-data', name: name};
  formData.append('file', file);
  const headers = await getHeaders()
  return fetch(BASE_URL + 'api/upload/image.html', {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
      ...headers
    },
    body: formData,
  }).then((response) => response.json())
}
