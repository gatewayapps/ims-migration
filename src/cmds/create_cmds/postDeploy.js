import { createPostDeploy } from '../../helpers/create'

export const command = 'post-deploy <name>'

export const aliases = [ 'post', 'postdeploy', 'postDeploy' ]

export const desc = 'Create a new post-deployment script'

export const builder = {}

export function handler (argv) {
  return createPostDeploy(argv.name)
}
