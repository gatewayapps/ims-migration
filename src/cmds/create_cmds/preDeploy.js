import { createPreDeploy } from '../../helpers/create'

export const command = 'pre-deploy <name>'

export const aliases = [ 'pre', 'predeploy', 'preDeploy' ]

export const desc = 'Create a new pre-deployment script'

export const builder = {}

export function handler (argv) {
  return createPreDeploy(argv.name)
}
