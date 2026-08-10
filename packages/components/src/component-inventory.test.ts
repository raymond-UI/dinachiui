import { describe, it, expect } from 'vitest'
import {
  isNewComponent,
  NEW_FOR_DAYS,
  publicComponents,
  type PublicComponentDefinition,
} from './component-inventory'

const day = 24 * 60 * 60 * 1000

function component(added?: string): PublicComponentDefinition {
  return { name: 'Test', slug: 'test', category: 'Motion', documented: true, added }
}

describe('isNewComponent', () => {
  it('badges a component released inside the window', () => {
    const now = new Date('2026-08-10')

    expect(isNewComponent(component('2026-08-01'), now)).toBe(true)
  })

  /** The whole point of the date: the badge clears itself rather than being cleared. */
  it('stops badging once the window has passed', () => {
    const added = new Date('2026-08-01')
    const after = new Date(added.getTime() + (NEW_FOR_DAYS + 1) * day)

    expect(isNewComponent(component('2026-08-01'), after)).toBe(false)
  })

  it('leaves a component with no date alone', () => {
    expect(isNewComponent(component(), new Date('2026-08-10'))).toBe(false)
  })

  /** A typo in the date should drop the badge, not render `NaN` into the sidebar. */
  it('treats an unparseable date as not new', () => {
    expect(isNewComponent(component('the first of August'), new Date())).toBe(false)
  })
})

describe('publicComponents', () => {
  it('has no duplicate slugs, which would collide as routes', () => {
    const slugs = publicComponents.map((c) => c.slug)

    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('gives every dated component a date that parses', () => {
    const dated = publicComponents.filter((c) => c.added)

    for (const c of dated) {
      expect(Number.isNaN(new Date(c.added as string).getTime())).toBe(false)
    }
  })
})
