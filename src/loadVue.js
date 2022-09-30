import fs from "fs";
import { jsPathReg, jsReg } from "./utils/reg.js";
import path from "path";
import { getCompName, getIconfontSource } from "./utils/index.js";

export default function iconfontToVue(iconfontJSSource, distDir) {
  const source = fs.readFileSync(iconfontJSSource).toString()
  iconfontToVueBySource(source, distDir)
}

export async function iconfontToVueByUrl(url, distDir) {
  const data = await getIconfontSource(url)
  iconfontToVueBySource(data, distDir)
}

export function iconfontToVueBySource(source, distDir) {
  const result = [...source.matchAll(jsReg)]

  result.forEach(({ groups }) => {
    const name = getCompName(groups.name)
    const vue = JSIconVueTemplate({ ...groups, name })
    fs.writeFileSync(path.join(distDir, `${ name }.js`), vue)
  })

  const index = JSIndexTemplate(result)
  const tsd = TSDescTemplate(result)
  fs.writeFileSync(path.join(distDir, `index.js`), index)
  fs.writeFileSync(path.join(distDir, `index.d.ts`), tsd)
}

const JSIndexTemplate = result => {
  const nameList = result.map(({ groups }) => getCompName(groups.name))
  let importContent = ''
  nameList.forEach(name => {
    importContent += `import ${ name } from './${ name }';\r`
  })
  let exportContent = `export {\r  ${ nameList.join(',\r  ') }\r}`
  return `${ importContent }\r ${ exportContent }`
}

const TSDescTemplate = result => {
  const nameList = result.map(({ groups }) => getCompName(groups.name))
  return `import { Component } from "vue";

declare module './index.js' {
  export default icons
}

declare interface icons {
  ${ nameList.join(': any | Component\r  ') }: any | Component
}
`
}

const JSIconVueTemplate = ({ name, path, viewBox }) => {
  const pathList = [...path.matchAll(jsPathReg)].map(r => r.groups.d)
  const pathStr = `[${ pathList.map(path => `
  createVNode('path', {
    d: '${ path }'
  }, null, -1)`).join(',\r') }\r]`
  return `import { defineComponent, openBlock, createBlock, createVNode } from 'vue';

const attrs = {
  xmlns: 'http://www.w3.org/2000/svg',
  fill: 'currentColor',
  viewBox: '${ viewBox }'
}

const path = ${ pathStr }

export default defineComponent({
  name: '${ getCompName(name) }',
  render() {
    openBlock()
    return createBlock('svg', attrs, path)
  }
});
`
}

const iconVueTemplate = ({ name, path, size, unicode }) =>
  `import { defineComponent, openBlock, createBlock, createVNode } from 'vue';

const attrs = {
  xmlns: 'http://www.w3.org/2000/svg',
  unicode: '${ unicode }',
  viewBox: '0 0 ${ size } ${ size }'
}

const path = createVNode('path', {
  fill: 'currentColor',
  d: '${ path }'
}, null, -1)

export default defineComponent({
  name: '${ name }',
  render() {
    openBlock()
    return createBlock('svg', attrs, [path])
  }
});
`
