import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { MapSvg } from './MapSvg'
import { layoutMap } from './mapLayout'
import type { MapChart } from './mapModel'

const chart: MapChart = {
  version: 1,
  kind: 'map',
  meta: { title: 'Program Locations', showTitle: true },
  sites: [
    {
      id: 'hsv',
      name: 'Huntsville, AL',
      geo: { x: 690, y: 373 },
      lcats: [{ id: 'a', title: 'Systems Engineer', lcat: 'Sr. Analyst', fte: 5, keyPersonnel: 1 }],
    },
    { id: 'den', name: 'Denver, CO', geo: { x: 379, y: 266 }, collapsed: true, lcats: [{ id: 'c', title: 'Data Scientist', fte: 2, keyPersonnel: 0 }] },
    { id: 'ram', name: 'Ramstein, Germany', oconus: true, lcats: [{ id: 'd', title: 'Logistics Specialist', fte: 2, keyPersonnel: 0 }] },
  ],
  legend: [],
  glossary: [],
}

describe('MapSvg', () => {
  const html = renderToStaticMarkup(<MapSvg layout={layoutMap(chart)} ariaLabel="test map" />)

  it('renders a self-contained svg with the map, a roster card, and the OCONUS strip', () => {
    expect(html.startsWith('<svg')).toBe(true)
    expect(html).toContain('Huntsville, AL') // expanded card
    expect(html).toContain('Sr. Analyst') // LCAT sub-label
    expect(html).toContain('Denver · 2 FTE') // collapsed chip text (short name + total)
    expect(html).toContain('OCONUS')
    expect(html).toContain('Ramstein, Germany')
    // No external references (fonts/images) that would break export.
    expect(html).not.toContain('http://www.w3.org/1999/xlink')
    expect(html).not.toMatch(/<image|xlink:href/)
  })

  it('marks selection chrome data-ui so export can strip it, and omits it otherwise', () => {
    expect(html).not.toContain('data-ui')
    const selected = renderToStaticMarkup(<MapSvg layout={layoutMap(chart)} selectedId="hsv" />)
    expect(selected).toContain('data-ui="selection"')
  })
})
