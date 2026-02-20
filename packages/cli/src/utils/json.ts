export function parseJsonWithComments<T>(content: string): T {
  let result = ''
  let inString = false
  let inSingleLineComment = false
  let inMultiLineComment = false
  let isEscaped = false

  for (let i = 0; i < content.length; i += 1) {
    const char = content[i]
    const next = content[i + 1]

    if (inSingleLineComment) {
      if (char === '\n') {
        inSingleLineComment = false
        result += char
      }
      continue
    }

    if (inMultiLineComment) {
      if (char === '*' && next === '/') {
        inMultiLineComment = false
        i += 1
      } else if (char === '\n') {
        result += char
      }
      continue
    }

    if (inString) {
      result += char
      if (!isEscaped && char === '"') {
        inString = false
      }
      isEscaped = !isEscaped && char === '\\'
      continue
    }

    if (char === '"') {
      inString = true
      isEscaped = false
      result += char
      continue
    }

    if (char === '/' && next === '/') {
      inSingleLineComment = true
      i += 1
      continue
    }

    if (char === '/' && next === '*') {
      inMultiLineComment = true
      i += 1
      continue
    }

    result += char
  }

  const withoutLineComments = result
  const withoutTrailingCommas = withoutLineComments.replace(/,\s*([}\]])/g, '$1')
  return JSON.parse(withoutTrailingCommas) as T
}
