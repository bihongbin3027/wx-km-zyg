/**
 * http://183.62.74.187:8130/zsyy_app_api/ 测试环境
 * http://10.2.20.90:6060/zsyy_app_api/  吴赟良
 */

let baseUrl, imgUrl, bannerUrl
if (process.env.NODE_ENV === 'development') {
  // baseUrl = 'http://zsyyapi.kmehosp.cn:9022/zsyy_app_api/'
  // imgUrl = 'http://zsyyfile.kmehosp.cn:9100/zsyy_resource/upload/kmzyg/doctor/'
  // bannerUrl = 'http://zsyyfile.kmehosp.cn:9100/zsyy_resource/'
  baseUrl = 'http://183.62.74.187:8130/zsyy_app_api/'
  imgUrl = 'http://183.62.74.187:8130/zsyy_resource/upload/kmzyg/doctor/'
  bannerUrl = 'http://183.62.74.187:8130/zsyy_resource/'
} else {
  // baseUrl = 'http://183.62.74.187:8130/zsyy_app_api/'
  // imgUrl = 'http://183.62.74.187:8130/zsyy_resource/upload/kmzyg/doctor/'
  // bannerUrl = 'http://183.62.74.187:8130/zsyy_resource/'
  baseUrl = 'http://zsyyapi.kmehosp.cn:9022/zsyy_app_api/'
  imgUrl = 'http://zsyyfile.kmehosp.cn:9100/zsyy_resource/upload/kmzyg/doctor/'
  bannerUrl = 'http://zsyyfile.kmehosp.cn:9100/zsyy_resource/'
}

export default { baseUrl, imgUrl, bannerUrl }