import { createProcedure } from '../../helpers/create'

export const command = 'procedure <name>'

export const desc = 'Create a new procedure script'

export const builder = {}

export function handler (argv) {
  return createProcedure(argv.name)
}
