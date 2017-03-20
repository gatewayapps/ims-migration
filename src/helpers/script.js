import fs from 'fs-extra'
import path from 'path'

export function loadScript (scriptName) {
  return fs.readFileSync(path.resolve(__dirname, `../../assets/scripts/${scriptName}`), {
    encoding: 'utf8'
  })
}
