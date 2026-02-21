#!/usr/bin/env node

import { Command } from 'commander'
import { addCommand } from './commands/add.js'
import { initCommand } from './commands/init.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const program = new Command()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function getCliVersion(): string {
  try {
    const packageJsonPath = path.resolve(__dirname, '../package.json')
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8')) as {
      version?: string
    }
    return packageJson.version ?? '0.0.0'
  } catch {
    return '0.0.0'
  }
}

program
  .name('dinachi')
  .description('Add Dinachi UI components to your project')
  .version(getCliVersion())

program
  .addCommand(addCommand)
  .addCommand(initCommand)

program.parse()
