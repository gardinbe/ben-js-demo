import { html, Suspended } from '@ben-js/core'
import { Link, Route, Router } from '@ben-js/router'

import { LoadingPanel } from '~/lib/components/LoadingPanel'
import { routes } from '~/routes'

export const App = () => html`
  <div class="min-h-dvh bg-zinc-950 text-zinc-100">
    <header
      class="sticky top-0 z-20 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur"
    >
      <div
        class="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3"
      >
        ${Link(
          {
            class: 'unstyled-link flex items-center gap-3',
            href: '/',
          },
          html`<span
              class="grid size-9 place-items-center rounded bg-cyan-300 font-black text-zinc-950"
            >
              b
            </span>
            <span>
              <span
                class="block text-sm font-semibold uppercase tracking-[0.22em] text-cyan-200"
              >
                ben-js
              </span>
              <span class="block text-lg font-black leading-5"
                >Systems demo</span
              >
            </span>`,
        )}
        <nav class="flex flex-wrap items-center gap-2 text-sm font-semibold">
          ${Link(
            {
              class: 'std-nav-link',
              href: '/',
            },
            'Dashboard',
          )}
          ${Link(
            {
              class: 'std-nav-link',
              href: '/pokemon',
            },
            'Pokemon lab',
          )}
          ${Link(
            {
              class: 'std-nav-link',
              href: '/apis',
            },
            'API workshop',
          )}
        </nav>
      </div>
    </header>
    <main class="mx-auto max-w-7xl px-4 py-6">
      ${Router(routes, () =>
        Suspended(Route(), LoadingPanel({ label: 'Routing module' })),
      )}
    </main>
  </div>
`
