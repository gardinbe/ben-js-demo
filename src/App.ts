import { Route, Router } from '@ben-js/router'
import { type Component, html, Suspended } from 'ben-js'

import { Footer } from '~/lib/components/Footer'
import { Loader } from '~/lib/components/Loader'
import { Nav } from '~/lib/components/Nav'
import { routes } from '~/routes'

export const App = (): Component => html`
  <header>${Nav()}</header>
  <main class="flex-1 py-4">
    ${Router(routes, () => Suspended(Route(), Loader()))}
  </main>
  <footer class="px-4 py-2 bg-gray-950">${Footer()}</footer>
`
