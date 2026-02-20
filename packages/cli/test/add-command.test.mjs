import test from 'node:test'
import assert from 'node:assert/strict'
import os from 'node:os'
import path from 'node:path'
import fs from 'node:fs'
import { execFileSync } from 'node:child_process'

const cliPath = path.resolve(process.cwd(), 'dist/index.js')

function runCli(args, cwd) {
  execFileSync(process.execPath, [cliPath, ...args], {
    cwd,
    stdio: 'pipe',
    encoding: 'utf-8',
  })
}

function createTempProject() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'dinachi-cli-test-'))
  fs.writeFileSync(
    path.join(root, 'package.json'),
    JSON.stringify(
      {
        name: 'cli-test',
        version: '1.0.0',
        dependencies: {
          react: '19.2.3',
        },
      },
      null,
      2
    )
  )
  return root
}

test('add handles legacy components.json and rewrites utils import relatively', async () => {
  const projectRoot = createTempProject()

  fs.writeFileSync(
    path.join(projectRoot, 'components.json'),
    JSON.stringify(
      {
        style: 'default',
        rsc: false,
        tsx: true,
        tailwind: {
          config: 'tailwind.config.ts',
          css: 'src/index.css',
          baseColor: 'slate',
          cssVariables: true,
        },
        aliases: {
          components: './src/components/ui',
          utils: './src/lib/utils',
        },
      },
      null,
      2
    )
  )

  fs.mkdirSync(path.join(projectRoot, 'src/lib'), { recursive: true })
  fs.writeFileSync(path.join(projectRoot, 'src/lib/utils.ts'), 'export const cn = (...a) => a.join(" ")\n')

  runCli(['add', 'button', '--skip-install'], projectRoot)

  const buttonPath = path.join(projectRoot, 'src/components/ui/button.tsx')
  const incorrectButtonPath = path.join(projectRoot, 'src/components/ui/ui/button.tsx')

  assert.equal(fs.existsSync(buttonPath), true)
  assert.equal(fs.existsSync(incorrectButtonPath), false)

  const buttonContent = fs.readFileSync(buttonPath, 'utf-8')
  assert.match(buttonContent, /from "\.\.\/\.\.\/lib\/utils"/)
})

