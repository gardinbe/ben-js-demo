import { type RouteComponent } from '@ben-js/router'
import {
  derived,
  html,
  type KeyedComponent,
  List,
  type Reactive,
  reactive,
  Swap,
  watch,
} from 'ben-js'

import { Button } from '~/lib/components/Button'
import { Metric } from '~/lib/components/Metric'
import { SectionTitle } from '~/lib/components/SectionTitle'

type DemoTask = {
  complexity: number
  done: boolean
  id: number
  label: string
  system: 'async' | 'reactivity' | 'router' | 'styling'
}

const initialTasks: Array<DemoTask> = [
  {
    complexity: 7,
    done: true,
    id: 1,
    label: 'Reset the source tree',
    system: 'router',
  },
  {
    complexity: 9,
    done: true,
    id: 2,
    label: 'Restore shared utilities and styles',
    system: 'styling',
  },
  {
    complexity: 8,
    done: false,
    id: 3,
    label: 'Exercise keyed list rendering',
    system: 'reactivity',
  },
  {
    complexity: 6,
    done: false,
    id: 4,
    label: 'Model async result states',
    system: 'async',
  },
]

const DashboardPage: RouteComponent = () => {
  const tasks = reactive(initialTasks)
  const filter = reactive<'all' | DemoTask['system']>('all')
  const activity = reactive<Array<string>>(['Dashboard mounted'])

  const filteredTasks = derived(() =>
    tasks.value.filter(
      task => filter.value === 'all' || task.system === filter.value,
    ),
  )
  const completeTasks = derived(
    () => tasks.value.filter(task => task.done).length,
  )
  const completion = derived(() =>
    Math.round((completeTasks.value / tasks.value.length) * 100),
  )
  const totalComplexity = derived(() =>
    tasks.value.reduce((sum, task) => sum + task.complexity, 0),
  )
  const rows = derived(() =>
    filteredTasks.value.map(task => ({
      component: TaskRow(task, next => {
        tasks.value = tasks.value.map(item =>
          item.id === task.id ? Object.assign({}, item, { done: next }) : item,
        )
      }),
      key: task.id,
    })),
  )
  const activityRows = derived(() =>
    activity.value.slice(0, 5).map((entry, index) => ({
      component: html`<li
        class="rounded border border-zinc-800 bg-zinc-950 px-3 py-2"
      >
        ${entry}
      </li>`,
      key: `${entry}-${index}`,
    })),
  )

  watch(
    completion,
    next => {
      activity.value = [
        `Completion recalculated to ${next}%`,
        ...activity.value,
      ]
    },
    { immediate: true },
  )

  const setFilter = (next: 'all' | DemoTask['system']) => {
    filter.value = next
    activity.value = [`Filter set to ${next}`, ...activity.value]
  }

  return html`
    <div class="space-y-6">
      <section
        class="grid gap-6 rounded border border-zinc-800 bg-zinc-900 p-5 md:grid-cols-[1.2fr_0.8fr]"
      >
        ${SectionTitle({
          copy: 'A rebuilt demo application showing routing, reactive primitives, derived data, keyed lists, conditional swaps, suspended routes, typed API calls, and Result-driven error handling.',
          eyebrow: 'Implementation map',
          title: 'A dense ben-js control room',
        })}
        <div class="grid content-start gap-3 sm:grid-cols-3 md:grid-cols-1">
          ${Metric({
            label: 'Completion',
            tone: 'text-emerald-300',
            value: derived(() => `${completion.value}%`),
          })}
          ${Metric({ label: 'Tracked systems', value: '4' })}
          ${Metric({
            label: 'Complexity score',
            tone: 'text-amber-300',
            value: totalComplexity,
          })}
        </div>
      </section>

      <section class="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div class="std-panel">
          <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p
                class="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-cyan-300"
              >
                Keyed List
              </p>
              <h2 class="m-0 text-2xl font-black">Feature workbench</h2>
            </div>
            <div class="flex flex-wrap gap-2">
              ${Button({ onClick: () => setFilter('all') }, 'All')}
              ${Button(
                { onClick: () => setFilter('reactivity') },
                'Reactivity',
              )}
              ${Button({ onClick: () => setFilter('async') }, 'Async')}
              ${Button({ onClick: () => setFilter('router') }, 'Router')}
            </div>
          </div>
          <div class="mb-5 h-3 overflow-hidden rounded bg-zinc-800">
            <div
              class="h-full bg-emerald-300 transition-all"
              style="${derived(() => `width: ${completion.value}%`)}"
            ></div>
          </div>
          <div class="grid gap-3">${List(rows)}</div>
        </div>

        <aside class="std-panel">
          <p
            class="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-cyan-300"
          >
            Watchers
          </p>
          <h2 class="m-0 mb-4 text-2xl font-black">Activity trace</h2>
          ${Swap(() => Activity(activity.value.length > 0, activityRows))}
        </aside>
      </section>
    </div>
  `
}

export default DashboardPage

const TaskRow = (task: DemoTask, onToggle: (next: boolean) => void) => html`
  <article
    class="grid gap-3 rounded border border-zinc-800 bg-zinc-950 p-4 md:grid-cols-[1fr_auto]"
  >
    <div>
      <div class="mb-2 flex flex-wrap items-center gap-2">
        <span class="std-badge">${task.system}</span>
        <span
          class="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500"
        >
          complexity ${task.complexity}
        </span>
      </div>
      <h3 class="m-0 text-lg font-bold">${task.label}</h3>
    </div>
    ${Button(
      { onClick: () => onToggle(!task.done) },
      task.done ? 'Done' : 'Mark done',
    )}
  </article>
`

const Activity = (
  hasActivity: boolean,
  activityRows: Reactive<Array<KeyedComponent>>,
) =>
  hasActivity
    ? html`<ul class="unstyled-list grid gap-2 text-sm text-zinc-300">
        ${List(activityRows)}
      </ul>`
    : html`<p class="text-zinc-400">No events yet.</p>`
