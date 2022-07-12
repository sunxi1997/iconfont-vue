import fs from "fs";
import { jsPathReg, jsReg } from "./reg.js";
import path from "path";

export default function iconfontToVue(iconfontJSSource, distDir) {
  const source = fs.readFileSync(iconfontJSSource).toString()
  const result = [...source.matchAll(jsReg)]

  result.forEach(({ groups }) => {
    const {
      name,
      viewBox,
      // path
    } = groups

    const vue = JSIconVueTemplate(groups)

    fs.writeFileSync(path.join(distDir, `${ name }.js`), vue)
  })

}

const JSIconVueTemplate = ({ name, path, viewBox }) => {
  const pathList = [...path.matchAll(jsPathReg)].map(r => r[0])
  const pathStr = `[${ pathList.map(path => `createVNode('path', {
  d: '${ path }'
}, null, -1)
`).join(',') }]`
  return `import { defineComponent, openBlock, createBlock, createVNode } from 'vue';

const attrs = {
  xmlns: 'http://www.w3.org/2000/svg',
  fill: 'currentColor',
  viewBox: '${ viewBox }'
}

const path = ${ pathStr }

export default defineComponent({
  name: '${ name }',
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
