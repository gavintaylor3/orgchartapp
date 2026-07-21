import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// Unit tests cover the pure layers (model, layout, templates) plus static SVG
// render checks (renderToStaticMarkup), so the default Node environment is enough
// — no DOM needed. The React plugin transforms JSX in .tsx test files.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'node',
    include: ['src/**/*.test.{ts,tsx}'],
  },
})
