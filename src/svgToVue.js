import fs from "fs";
import path from "path";
import { jsPathReg, svgReg } from "./utils/reg.js";
import { getCompName } from "./utils/index.js";

export default function svgToVue(svgSourceDir, distDir) {
  const fileList = fs.readdirSync(svgSourceDir)
  fileList.forEach(file => {
    const name = getCompName(file.replace(/(^.+)\.svg$/, (_, $1) => $1))
    const svg = fs.readFileSync(path.join(svgSourceDir, file)).toString()
    const res = svg.match(svgReg)
    if (!res) {
      return
    }
    const { width, height } = res.groups
    const viewBox = `0 0 ${ width } ${ height }`
    svg.replace(/(<svg[^>]+)\swidth="(\d+)"/, (_, $1) => $1)
    svg.replace(/(<svg[^>]+)\sheight="(\d+)"/, (_, $1) => $1)
    svg.replace(/<svg\s/, `<svg viewBox=${ viewBox }`)

    const iconVue = JSIconVueTemplate(name, svg)

    fs.writeFileSync(path.join(distDir, `${ name }.vue`), iconVue)
  })
}

function JSIconVueTemplate(name, content) {
  return `<template>
  ${ content }
</template>

<script>
export default {
  name: '${ getCompName(name) }'
}
</script>
`
}
