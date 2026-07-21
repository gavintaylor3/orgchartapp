import { useState } from 'react'
import App from './App'
import { MapApp } from './MapApp'
import { isMapDocument, type ChartDocument } from './document'

/*
 * Top-level router between the two document kinds. The org chart and the U.S. map
 * each persist to their own localStorage slot, so switching between them never
 * loses work. Loading a JSON file of the other kind writes it to that slot and
 * flips the mode.
 */

const KIND_KEY = 'astrion-doc-kind'
const ORG_KEY = 'astrion-org-chart-v1'
const MAP_KEY = 'astrion-map-v1'

type Kind = 'org' | 'map'

function loadKind(): Kind {
  return localStorage.getItem(KIND_KEY) === 'map' ? 'map' : 'org'
}

export default function Root() {
  const [kind, setKind] = useState<Kind>(loadKind)

  const switchTo = (k: Kind) => {
    localStorage.setItem(KIND_KEY, k)
    setKind(k)
  }

  // A loaded document of the other kind: stash it in that slot, then switch so
  // the target app mounts fresh and reads it.
  const loadForeign = (doc: ChartDocument) => {
    const map = isMapDocument(doc)
    localStorage.setItem(map ? MAP_KEY : ORG_KEY, JSON.stringify(doc))
    switchTo(map ? 'map' : 'org')
  }

  return kind === 'map' ? (
    <MapApp onSwitchToOrg={() => switchTo('org')} onLoadForeign={loadForeign} />
  ) : (
    <App onSwitchToMap={() => switchTo('map')} onLoadForeign={loadForeign} />
  )
}
