#!/usr/bin/env node

import { Command } from 'commander'
import { addCommand } from './commands/add.js'
import { initCommand } from './commands/init.js'
import chalk from 'chalk'

const program = new Command()

program
  .name('dinachi')
  .description('Add Dinachi UI components to your project')
  .version('0.5.0')

program
  .addCommand(addCommand)
  .addCommand(initCommand)

program.parse()
