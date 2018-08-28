import { Platform } from 'react-native'
import OpenFile from 'react-native-doc-viewer'

export const openFile = (path, filename) => {
  return new Promise((resolve, reject) => {
    if (Platform.OS == 'ios') {
      const url = path.replace('file://', '')
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
