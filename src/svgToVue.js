import fs from "fs";
import path from "path";
import { svgReg } from "./utils/reg.js";
import { getCompName } from "./utils/index.js";

export default function svgToVue(svgSourceDir, distDir, { fileNameCallback, CompNameCallback } = {}) {
  const fileList = fs.readdirSync(svgSourceDir)
  fileList.forEach(file => {
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

    fs.writeFileSync(path.join(distDir, `${ fileName }.vue`), iconVue)
  })
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
