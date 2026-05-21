import {
  define,
  type ExportedRouteComponent,
  type RouteDefinition,
} from '@ben-js/router'

export const routes: Array<RouteDefinition> = [
  {
    component: define(() => import('~/pages/Dashboard')),
    path: '',
  },
  {
    component: define(() => delayed(import('~/pages/PokemonLab'))),
    path: 'pokemon',
  },
  {
    component: define(() => delayed(import('~/pages/ApiWorkshop'))),
    path: 'apis',
  },
]

const delayed = async (
  importer: Promise<ExportedRouteComponent>,
): Promise<ExportedRouteComponent> => {
  await new Promise<void>(resolve => {
    setTimeout(resolve, 250)
  })

  return importer
}
