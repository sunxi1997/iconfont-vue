import path from 'path'
import { fileURLToPath } from 'url'
import svgToVue from "../../src/svgToVue.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const sourceDir = path.join(__dirname, './svg')
const distDir = path.join(__dirname, './icon-vue')

svgToVue(sourceDir, distDir)
