import { createView } from '../../helpers/create'

export const command = 'view <name>'

export const desc = 'Create a new view script'

export const builder = {}

export function handler (argv) {
  return createView(argv.name)
}
