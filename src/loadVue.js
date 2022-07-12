import fs from "fs";
import { jsPathReg, jsReg } from "./reg.js";
import path from "path";

export default function iconfontToVue(iconfontJSSource, distDir) {
  const source = fs.readFileSync(iconfontJSSource).toString()
  const result = [...source.matchAll(jsReg)]

  result.forEach(({ groups }) => {
    const name = getCompName(groups.name)
    const vue = JSIconVueTemplate({ ...groups, name })
    fs.writeFileSync(path.join(distDir, `${ name }.js`), vue)
  })

  const index = JSIndexTemplate(result)
  fs.writeFileSync(path.join(distDir, `index.js`), index)
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


function getCompName(name) {
  return name.replaceAll(/(-|^)(.)/g, ($0, $1, $2) => $2.toUpperCase())
}
