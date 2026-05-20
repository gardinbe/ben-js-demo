import {
  define,
  type ExportedRouteComponent,
  type RouteDefinition,
} from '@ben-js/router'

export const routes: Array<RouteDefinition> = [
  {
    component: define(() => fakeDelay(import('~/pages/Home'))),
    path: '',
  },
  {
    component: define(() => fakeDelay(import('~/pages/About'))),
    path: 'about',
  },
  {
    children: [
      {
        component: define(() => fakeDelay(import('~/pages/Pokemon/[slug]'))),
        path: '[slug]',
      },
    ],
    component: define(() => fakeDelay(import('~/pages/Pokemon'))),
    path: 'pokemon',
  },
  {
    component: define(() => fakeDelay(import('~/pages/Calculator'))),
    path: 'calculator',
  },
  {
    component: define(() => fakeDelay(import('~/pages/TodoList'))),
    path: 'todo-list',
  },
  {
    component: define(() => fakeDelay(import('~/pages/TestForm'))),
    path: 'test-form',
  },
]

const fakeDelay = async (
  importer: Promise<ExportedRouteComponent>,
): Promise<ExportedRouteComponent> => {
  await new Promise<void>(res => {
    setTimeout(res, 750)
  })
  return importer
}
