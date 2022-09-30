import axios from "axios";

export function getCompName(name) {
  return getFileName(name).replace(/^(\d+)/, 'Icon$1')
}

export function getFileName(name) {
  return name.replaceAll(/(-|\s+|^)(.)/g, ($0, $1, $2) => $2.toUpperCase())
}

export function vueTemplate(content) {
  return content.replace('<style type="text/css"></style>', '')
  .replace(/<style\s*\/>/, '')
}

export async function getIconfontSource(iconfontUrl) {
  const url = iconfontUrl.replace(/^\/\//, 'https://')
  const { data } = await axios.get(url)
  return data
}
