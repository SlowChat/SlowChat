import { Platform } from 'react-native'
import { DOMAIN } from '../constants'
import Storage from './storage'
import URL from './url'

const BASE_URL = DOMAIN + '/'


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
    timeout: 10,
  }).then((response) => response.json()).catch((err) => {
    // console.log(eval("("+ err +")"));
    console.log(err);
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
    timeout: 10,
  }).then((response) => response.json())
  // .catch((err) => {
  //   // console.log(eval("("+ err +")"));
  //   throw err
  // });
}

export function uploadImage(uri, fileName) {
  const serverUrl = BASE_URL + 'api/upload/image.html'
  return upload(uri, fileName, serverUrl)
}
export async function upload(uri, fileName, serverUrl) {
  let formData = new FormData();
  const name = fileName || uri.substring(uri.lastIndexOf('/') + 1, uri.length)
  uri = uri.replace('file://', '')
  let file = {uri: uri, type: 'multipart/form-data', name: name};
  formData.append('file', file);
  const headers = await getHeaders()
  // return fetch(BASE_URL + 'api/upload/image.html', {
  serverUrl = serverUrl || BASE_URL + 'api/upload/files.html'
  return fetch(serverUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
      ...headers
    },
    body: formData,
  }).then((response) => response.json())
}

import RNFS from 'react-native-fs'

export async function rnfsUpload(uploadFiles, onProgress) {
  if (!uploadFiles || uploadFiles.length == 0) return []

  const files = uploadFiles.map(item => ({
    name: item.filename.substring(0, item.filename.lastIndexOf('.')),
    filename: item.filename,
    filepath: item.url.replace('file://', ''),
    filetype: 'image/png',
  }))


  const uploadBegin = (response) => {
    let jobId = response.jobId;
    console.log('UPLOAD HAS BEGUN! JobId: ' + jobId);
  }

  const uploadProgress = (response) => {
    const { totalBytesSent, totalBytesExpectedToSend } = response
    let percentage = Math.floor(totalBytesSent / totalBytesExpectedToSend * 100);
    console.log('UPLOAD IS ' + percentage + '% DONE!');
    onProgress && onProgress(percentage)
  };

  try {
    console.log(files);
    const headers = await getHeaders()
    const res = await RNFS.uploadFiles({
      toUrl: BASE_URL + 'api/upload/files.html',
      files,
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        ...headers
      },
      fields: {},
      begin: uploadBegin,
      progress: uploadProgress
    }).promise
    console.log(res.body)
    if (res.statusCode == 200) {
      console.log('FILES UPLOADED!');
      return res
    } else {
      console.log('SERVER ERROR');
    }
  } catch (e) {
    if(e.description === "cancelled") {
      // cancelled by user
    }
    console.log(e);
  }
}

//
// export async function uploadFile(uri, fileName) {
//   let formData = new FormData();
//   const name = fileName || uri.substring(uri.lastIndexOf('/') + 1, uri.length)
//   let file = {uri: uri, type: 'multipart/form-data', name};
//   formData.append('file', file);
//   const headers = await getHeaders()
//   return fetch(BASE_URL + 'api/upload/flies.html', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'multipart/form-data',
//       ...headers
//     },
//     body: formData,
//   }).then((response) => response.json())
// }
