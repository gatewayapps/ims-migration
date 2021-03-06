import { createMigration } from '../../helpers/create'

export const command = 'migration <name>'

export const desc = 'Create a new migration script'

export const builder = {}

export function handler (argv) {
  return createMigration(argv.name)
}
