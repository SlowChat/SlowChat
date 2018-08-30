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
    'MY-Token': token,
    'MY-Device-Type': Platform.OS == 'ios' ? 'iphone' : 'android'
  }
}

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

export async function upload(item) {
  let serverUrl = BASE_URL + 'api/upload/image.html'
  const { url, path, filename, ext } = item
  let uri = url || path
  if (Platform.OS == 'android') {
    if (uri.indexOf('file://') == -1 && uri.indexOf('content://') == -1) {
      uri = `file://${uri}`
    }
  } else {
    uri = uri.replace('file://', '')
  }
  const name = encodeURIComponent(filename || uri.substring(uri.lastIndexOf('/') + 1))
  // uri = 'assets-library://asset/asset.JPG?id=2BC4E5C9-7080-4E0D-8F0E-AD570DF614E8&ext=JPG'
  let file = {uri, type: 'multipart/form-data', name}
  let formData = new FormData();
  formData.append('file', file);
  if (ext && ext != 'image') {
    serverUrl = BASE_URL + 'api/upload/files.html'
    formData.append('filetype', ext);
  }
  const headers = await getHeaders()
  console.log(headers)
  console.log(file);
  return fetch(serverUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
      ...headers
    },
    body: formData,
  }).then((response) => {
    try {
      console.log(response._bodyText)
    } catch (e) {
    }
    return response.json()
  })
}

import RNFS from 'react-native-fs'

export async function rnfsUpload(uploadFiles, onProgress) {
  if (!uploadFiles || uploadFiles.length == 0) return []

  const files = uploadFiles.map(item => {
    return {
      name: item.filename.substring(0, item.filename.lastIndexOf('.')),
      filename: item.filename,
      filepath: item.url.replace('file://', ''),
      filetype: item.ext || item.url.substring(item.url.lastIndexOf('.') + 1),
    }
  })


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
