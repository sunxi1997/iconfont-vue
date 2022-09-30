import path from "path";
import fs from "fs";
import { jsReg } from "./utils/reg.js";
import axios from "axios";

export default function iconfontToSvg(iconfontJSSource, distDir) {
  const source = fs.readFileSync(iconfontJSSource).toString()
  iconfontToSvgBySource(source, distDir)
}

export async function iconfontToSvgByUrl(url, distDir) {
  const { data } = await axios.get(url.replace(/^\/\//, 'https://'))
  iconfontToSvgBySource(data, distDir)
}

export function iconfontToSvgBySource(source, distDir) {
  const result = [...source.matchAll(jsReg)]

  result.forEach(({ groups }) => {
    const {
      name,
      viewBox,
      // path
    } = groups

    const svg = JSSvgTemplate(groups)

    fs.writeFileSync(path.join(distDir, `${ name }.svg`), svg)
  })
}

const JSSvgTemplate = ({ name, path, viewBox }) =>
  `<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg name="${ name }" fill="currentColor" viewBox="${ viewBox }" version="1.1" xmlns="http://www.w3.org/2000/svg"
     xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200">
    ${ path }
</svg>`


const svgTemplate = ({ name, path, size, unicode }) =>
  `<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg name="${ name }" unicode="${ unicode }" class="icon" viewBox="0 0 ${ size } ${ size }" version="1.1" xmlns="http://www.w3.org/2000/svg"
     xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200">
    <path fill="currentColor" d="${ path }"></path>
</svg>`
