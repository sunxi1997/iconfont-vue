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
