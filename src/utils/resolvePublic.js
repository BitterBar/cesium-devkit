/**
 * @description 生成公共资源路径
 * @param {string} url
 */
export default function resolvePublic(url) {
  return (`${import.meta.env.BASE_URL}/` + url).replace(/\/+/g, '/')
}
