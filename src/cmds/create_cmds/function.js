import { createScalarFunction, createTableFunction } from '../../helpers/createHelper'

export const command = 'function <name> [type]'

export const desc = 'Create a new function script'

export const builder = {
  type: {
    alias: 't',
    default: 'scalar',
    description: 'Type of function to create either "table" or "scalar"'
  }
}

export function handler (argv) {
  switch (argv.type.toLowerCase()) {
    case 'table':
      return createTableFunction(argv.name)

    default:
      return createScalarFunction(argv.name)
  }
}
