export const DEPENDENCY_VERSION_MAP: Record<string, string> = {
  '@base-ui/react': '^1.3.0',
  'lucide-react': '^0.552.0',
  'class-variance-authority': '^0.7.1',
  'tailwindcss-animate': '^1.0.7',
  'tw-animate-css': '^1.3.4',
  'clsx': '^2.1.1',
  'tailwind-merge': '^3.3.1',
  '@json-render/core': '^0.14.0',
  '@json-render/react': '^0.14.0',
  'zod': '^4.0.0',
}

export function toInstallSpec(dep: string): string {
  const version = DEPENDENCY_VERSION_MAP[dep]
  return version ? `${dep}@${version}` : dep
}

