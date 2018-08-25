import { Platform } from 'react-native'
import OpenFile from 'react-native-doc-viewer'

export const openNetworkFile = (url, filename) => {
  return new Promise((resolve, reject) => {
    if (Platform.OS == 'ios') {
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

//
// const openVideo = (local) => {
//   if(Platform.OS === 'ios'){
//         OpenFile.openDoc([{url:SavePath+"/react-native-logo.jpg",
//         fileNameOptional:"test filename"
//       }], (error, url) => {
//          if (error) {
//           this.setState({animating: false});
//          } else {
//           this.setState({animating: false});
//            console.log(url)
//          }
//        })
//     }else{
//       OpenFile.openDoc([{url:SavePath+"/demo.jpg",
//         fileName:"sample",
//         cache:false,
//         fileType:"jpg"
//       }], (error, url) => {
//          if (error) {
//           this.setState({animating: false});
//          } else {
//           this.setState({animating: false});
//            console.log(url)
//          }
//        })
//
//     }
// }
