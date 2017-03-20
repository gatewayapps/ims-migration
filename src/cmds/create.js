export const command = 'create <command>'

export const desc = 'Create a new database script'

export function builder (yargs) {
  return yargs.commandDir('create_cmds')
}

export function handler (argv) {}
