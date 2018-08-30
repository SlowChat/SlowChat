import { Platform, CameraRoll } from 'react-native'
import OpenFile from 'react-native-doc-viewer'
import RNFS from 'react-native-fs'
import { checkSavePermission } from './permission'

export const openFile = (path, filename) => {
  return new Promise((resolve, reject) => {
    path = path.replace('file://', '')
    if (filename.indexOf('/') > -1) {
      filename = filename.substring(filename.lastIndexOf('/') + 1)
    }
    if (Platform.OS == 'ios') {
      OpenFile.openDoc([{
        url: path,
        fileNameOptional: filename
      }], (err, url) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    } else {
      try {
        const fileType = filename.substring(filename.lastIndexOf('.') + 1)
        let url = path.indexOf('http') == 0 ? path : 'file://' +  path
        OpenFile.openDoc([{
          url,
          fileName: filename,
          cache: false,
          fileType
        }], (err, url) => {
         if (err) {
           reject(err)
         } else {
           resolve()
         }
       })
      } catch (e) {
        console.log(e);
      }
    }
  })
}

export const downFile = async (url) => {
  if (Platform.OS == 'ios') {
    return CameraRoll.saveToCameraRoll(url)
  } else {
    try {
      await checkSavePermission()
    } catch (e) {
      throw e
    }
    const dirs = Platform.OS === 'ios' ? RNFS.LibraryDirectoryPath : RNFS.ExternalDirectoryPath //外部文件，共享目录的绝对路径（仅限android）
    const ext = url.substring(url.lastIndexOf('.') + 1)
    const downloadDest = `${dirs}/${((Math.random() * 10000000) | 0)}.${ext}`;
    const options = {
      fromUrl: url,
      toFile: downloadDest,
      background: true,
    }
    try {
      await RNFS.downloadFile(options).promise
      console.log('file://' + downloadDest)
      return CameraRoll.saveToCameraRoll(downloadDest)
    } catch (e) {
      console.log("err", e)
      if (typeof e == 'string') {
        throw new Error(e)
      }
      throw e
    }
  }
}
