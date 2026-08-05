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

function writeConfig(projectRoot) {
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
          components: './src/components',
          utils: './src/lib/utils',
          ui: './src/components/ui',
          lib: './src/lib',
        },
      },
      null,
      2
    )
  )
}

function installedComponents(projectRoot) {
  return fs
    .readdirSync(path.join(projectRoot, 'src/components/ui'))
    .filter(name => name.endsWith('.tsx'))
    .map(name => name.replace(/\.tsx$/, ''))
}

const MOTION = ['marquee', 'text-morph', 'hold-to-confirm', 'stagger-list']

test('add --all installs the core tier and leaves the motion tier out', async () => {
  const projectRoot = createTempProject()
  writeConfig(projectRoot)

  runCli(['add', '--all', '--skip-install'], projectRoot)

  const installed = installedComponents(projectRoot)
  assert.ok(installed.includes('button'))
  for (const name of MOTION) {
    assert.equal(installed.includes(name), false, `${name} should not arrive with --all`)
  }
})

test('add --motion installs the motion tier', async () => {
  const projectRoot = createTempProject()
  writeConfig(projectRoot)

  runCli(['add', '--motion', '--skip-install'], projectRoot)

  const installed = installedComponents(projectRoot)
  for (const name of MOTION) {
    assert.ok(installed.includes(name), `${name} should arrive with --motion`)
  }
  assert.equal(installed.includes('button'), false)
})

test('add --all --motion installs both tiers', async () => {
  const projectRoot = createTempProject()
  writeConfig(projectRoot)

  runCli(['add', '--all', '--motion', '--skip-install'], projectRoot)

  const installed = installedComponents(projectRoot)
  assert.ok(installed.includes('button'))
  for (const name of MOTION) {
    assert.ok(installed.includes(name))
  }
})

