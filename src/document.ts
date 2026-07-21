import { normalizeChart, type OrgChart } from './model'
import { normalizeMap, type MapChart } from './mapModel'

/*
 * A saved document is either an org chart or a U.S. map, discriminated by `kind`
 * ('map' => MapChart; absent or 'org' => OrgChart). One normalizer routes any
 * untrusted input (localStorage, imported file, JSON tab) to the right model, so
 * legacy org files with no `kind` keep loading unchanged.
 */

export type ChartDocument = OrgChart | MapChart

export function isMapDocument(doc: ChartDocument): doc is MapChart {
  return (doc as { kind?: string }).kind === 'map'
}

export function normalizeDocument(input: unknown): ChartDocument {
  if (input && typeof input === 'object' && (input as { kind?: string }).kind === 'map') {
    return normalizeMap(input)
  }
  return normalizeChart(input)
}
