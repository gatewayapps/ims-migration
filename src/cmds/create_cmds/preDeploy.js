import { createPreDeploy } from '../../helpers/createHelper'

export const command = 'preDeploy <name>'

export const aliases = [ 'pre', 'predeploy', 'pre-deploy' ]

export const desc = 'Create a new pre-deployment script'

export const builder = {}

export function handler (argv) {
  return createPreDeploy(argv.name)
}
