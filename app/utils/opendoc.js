import { Platform } from 'react-native'
// import RNFS from 'react-native-fs'
import OpenFile from 'react-native-doc-viewer'

export const openFile = (url, filename) => {
  return new Promise((resolve, reject) => {
    if (Platform.OS == 'ios') {
      url = url.replace('file://', '')
      OpenFile.openDoc([{
        url,
        fileNameOptional: filename
      }], (err, url) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
       })
    } else {
      const fileType = filename.substring(filename.lastIndexOf('.') + 1)
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
    }
  })
}
