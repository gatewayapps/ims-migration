import { createPostDeploy } from '../../helpers/create'

export const command = 'postDeploy <name>'

export const aliases = [ 'post', 'postdeploy', 'post-deploy' ]

export const desc = 'Create a new post-deployment script'

export const builder = {}

export function handler (argv) {
  return createPostDeploy(argv.name)
}
