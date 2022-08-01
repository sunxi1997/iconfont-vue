import fs from "fs";
import path from "path";
import { svgReg } from "./utils/reg.js";
import { getCompName } from "./utils/index.js";

export default function svgToVue(svgSourceDir, distDir, { fileNameCallback, CompNameCallback } = {}) {
  const fileList = fs.readdirSync(svgSourceDir)
  const files = fileList.map(file => {
    const name = getCompName(file.replace(/(^.+)\.svg$/, (_, $1) => $1))
    let svg = fs.readFileSync(path.join(svgSourceDir, file)).toString()
    const res = svg.match(svgReg)
    if (!res) {
      return
    }
    const { width, height } = res.groups
    const viewBox = `0 0 ${ width } ${ height }`
    svg = svg
    .replace(/(<svg[^>]*)\swidth="(\d+)"/, (_, $1) => $1)
    .replace(/(<svg[^>]*)\sheight="(\d+)"/, (_, $1) => $1)
    .replace(/<svg\s/, `<svg viewBox="${ viewBox }" `)

    const iconVue = JSIconVueTemplate(name, svg, CompNameCallback)

    const fileName = fileNameCallback ? fileNameCallback(name) : name

    return [fileName, iconVue]
  })
  files.forEach(([fileName, fileContent]) => {
    fs.writeFileSync(path.join(distDir, `${ fileName }.vue`), fileContent)
  })
  const index = JSIndexTemplate(files)
  fs.writeFileSync(path.join(distDir, `index.js`), index)
}

function JSIconVueTemplate(name, content, CompNameCallback) {
  let compName = getCompName(name)
  if (CompNameCallback) {
    compName = CompNameCallback(compName)
  }
  return `<template>
  ${ content }
</template>

<script>
export default {
  name: '${ compName }'
}
</script>
`
}

function JSIndexTemplate(fileList) {
  const nameList = fileList.map(([name]) => name)
  let importContent = ''
  nameList.forEach(name => {
    importContent += `import ${ name } from './${ name }';\r`
  })
  let exportContent = `export {\r  ${ nameList.join(',\r  ') }\r}`
  return `${ importContent }\r ${ exportContent }`
}
