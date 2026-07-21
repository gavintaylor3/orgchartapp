import { describe, expect, it } from 'vitest'
import { isMapDocument, normalizeDocument } from './document'

describe('normalizeDocument', () => {
  it('routes a map document to the map normalizer', () => {
    const doc = normalizeDocument({ kind: 'map', sites: [{ name: 'DC', geo: { x: 1, y: 2 }, lcats: [] }] })
    expect(isMapDocument(doc)).toBe(true)
    if (isMapDocument(doc)) expect(doc.sites).toHaveLength(1)
  })

  it('treats a legacy document with no kind as an org chart', () => {
    const doc = normalizeDocument({ roots: [{ id: 'a', title: 'A', variant: 'primary' }] })
    expect(isMapDocument(doc)).toBe(false)
    if (!isMapDocument(doc)) expect(doc.roots).toHaveLength(1)
  })

  it('treats an explicit org kind as an org chart', () => {
    const doc = normalizeDocument({ kind: 'org', roots: [{ id: 'a', title: 'A', variant: 'primary' }] })
    expect(isMapDocument(doc)).toBe(false)
  })
})
