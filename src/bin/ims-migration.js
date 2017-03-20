#!/usr/bin/env node
import yargs from 'yargs'

export const argv = yargs.commandDir('../cmds')
  .demandCommand()
  .help()
  .argv
