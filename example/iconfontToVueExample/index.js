import path from 'path'
import { fileURLToPath } from 'url'
import { iconfontToVueByUrl } from "../../index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const iconfontSymbolUrl = '//at.alicdn.com/t/c/font_921544_9hl0di2305n.js'

const distDir = path.join(__dirname, './icon-vue')

await iconfontToVueByUrl(iconfontSymbolUrl, distDir)
