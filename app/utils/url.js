import parseQuery from './query'
import stringify from './url_stringify'

export default {
  parse: function (url) {
    let arr1 = url.split('?')
    let uri = arr1[0]
    let queryString = arr1.length === 2 ? arr1[1] : ''
    let arr2 = url.split('#')
    let hash = arr2.length === 2 ? arr2[1] : undefined
    let query = parseQuery(queryString)

    return {
      uri,
      hash,
      query
    }
  },
  stringify: function (uri, query, hash) {
    let url = stringify(uri, query)
    if (hash) {
      url += ('#/' + hash)
    }
    return url
  }
}
