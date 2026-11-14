import { spawnSync } from 'child_process'

/**
 * The last release before components registered with the agent bridge. Its templates
 * ship inside that release, so installing them is running it.
 */
export const V1_CLI_VERSION = '0.12.0'

/**
 * Re-runs this `add` with the v1 CLI, passing on every argument but `--v1`. Returns the
 * exit code to leave with.
 */
export function runV1Add(argv: string[] = process.argv): number {
  const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx'
  const result = spawnSync(npx, ['--yes', `@dinachi/cli@${V1_CLI_VERSION}`, 'add', ...v1AddArgs(argv)], {
    stdio: 'inherit',
  })
  if (result.error) {
    console.error(`Could not run @dinachi/cli@${V1_CLI_VERSION}: ${result.error.message}`)
    return 1
  }
  return result.status ?? 1
}

function v1AddArgs(argv: string[]): string[] {
  const at = argv.indexOf('add')
  return at === -1 ? [] : argv.slice(at + 1).filter((arg) => arg !== '--v1')
}
