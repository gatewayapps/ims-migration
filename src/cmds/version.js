export const command = 'version'

export const desc = 'Prints the version of the ims-migration tool'

export const builder = {}

export function handler (argv) {
  const pkg = require('../../package.json')
  console.log(pkg.version)
}
