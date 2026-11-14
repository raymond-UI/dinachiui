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
  const windows = process.platform === 'win32'
  const args = ['--yes', `@dinachi/cli@${V1_CLI_VERSION}`, 'add', ...v1AddArgs(argv)]
  // Node refuses to spawn a .cmd file without a shell, so on Windows the arguments go
  // through cmd.exe and are quoted for it.
  const result = windows
    ? spawnSync('npx.cmd', args.map(quoteForCmd), { stdio: 'inherit', shell: true })
    : spawnSync('npx', args, { stdio: 'inherit' })
  if (result.error) {
    console.error(`Could not run @dinachi/cli@${V1_CLI_VERSION}: ${result.error.message}`)
    return 1
  }
  return result.status ?? 1
}

function quoteForCmd(arg: string): string {
  return /^[\w@./:=-]+$/.test(arg) ? arg : `"${arg.replace(/"/g, '""')}"`
}

function v1AddArgs(argv: string[]): string[] {
  const at = argv.indexOf('add')
  return at === -1 ? [] : argv.slice(at + 1).filter((arg) => arg !== '--v1')
}
