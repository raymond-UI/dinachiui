import test from 'node:test'
import assert from 'node:assert/strict'
import os from 'node:os'
import path from 'node:path'
import fs from 'node:fs'
import { execFileSync } from 'node:child_process'

const cliPath = path.resolve(process.cwd(), 'dist/index.js')

function run(args, cwd, env = {}) {
  const clean = { ...process.env, ...env }
  delete clean.npm_config_user_agent
  Object.assign(clean, env)
  return execFileSync(process.execPath, [cliPath, ...args], { cwd, stdio: 'pipe', encoding: 'utf-8', env: clean, timeout: 30000 })
}

function monorepoApp({ lockfile = 'pnpm-lock.yaml' } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'dinachi-init-test-'))
  fs.writeFileSync(path.join(root, 'package.json'), JSON.stringify({ name: 'mono', private: true }))
  if (lockfile) fs.writeFileSync(path.join(root, lockfile), '')
  const app = path.join(root, 'apps', 'web')
  fs.mkdirSync(path.join(app, 'src', 'app'), { recursive: true })
  fs.writeFileSync(
    path.join(app, 'package.json'),
    JSON.stringify({ name: 'web', dependencies: { react: '19.2.3', next: '16.0.0', tailwindcss: '4.1.0' } }),
  )
  fs.writeFileSync(path.join(app, 'src', 'app', 'globals.css'), '@import "tailwindcss";\n')
  return app
}

test('init uses the package manager of the enclosing monorepo', () => {
  const out = run(['init', '--skip-install', '-y'], monorepoApp())
  assert.match(out, /pnpm add class-variance-authority/)
})

test('init falls back to the invoking package manager when nothing on disk says', () => {
  const out = run(['init', '--skip-install', '-y'], monorepoApp({ lockfile: null }), {
    npm_config_user_agent: 'yarn/4.5.0 npm/? node/v22.0.0',
  })
  assert.match(out, /yarn add class-variance-authority/)
})

test('init on Tailwind 4 declares a class-based dark variant once', () => {
  const app = monorepoApp()
  run(['init', '--skip-install', '-y'], app)
  const css = fs.readFileSync(path.join(app, 'src', 'app', 'globals.css'), 'utf-8')
  assert.equal(css.match(/@custom-variant dark/g)?.length, 1)
  assert.match(css, /@custom-variant dark \(&:where\(\.dark, \.dark \*\)\);/)
})

test('init keeps an existing dark variant instead of adding a second', () => {
  const app = monorepoApp()
  fs.writeFileSync(path.join(app, 'src', 'app', 'globals.css'), '@import "tailwindcss";\n@custom-variant dark (&:is(.dark *));\n')
  run(['init', '--skip-install', '-y'], app)
  const css = fs.readFileSync(path.join(app, 'src', 'app', 'globals.css'), 'utf-8')
  assert.equal(css.match(/@custom-variant dark/g)?.length, 1)
})

test('add -y keeps an existing file instead of prompting', () => {
  const app = monorepoApp()
  run(['init', '--skip-install', '-y'], app)
  run(['add', 'button', '--skip-install', '-y'], app)
  const file = path.join(app, 'src', 'components', 'ui', 'button.tsx')
  fs.writeFileSync(file, '// edited\n')
  const out = run(['add', 'button', '--skip-install', '-y'], app)
  assert.match(out, /Kept existing button\.tsx/)
  assert.equal(fs.readFileSync(file, 'utf-8'), '// edited\n')
})
