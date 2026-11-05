import {
  html,
  type KeyedComponent,
  List,
  normalize,
  type Props,
  Swap,
} from '@ben-js/core'
import { derived, type Reactive, reactive, watch } from '@ben-js/reactivity'
import { type RouteComponent } from '@ben-js/router'

import { Button } from '~/lib/components/Button'
import { Icon, IconName } from '~/lib/components/Icon'
import { Metric } from '~/lib/components/Metric'
import { SectionTitle } from '~/lib/components/SectionTitle'

type AreaFilter = 'all' | WorkstreamArea

type Workstream = {
  area: WorkstreamArea
  complete: boolean
  id: number
  impact: number
  label: string
  owner: string
  priority: 'high' | 'low' | 'medium'
  summary: string
}

type WorkstreamArea = 'api' | 'routing' | 'state' | 'ui'

const workstreams: Array<Workstream> = [
  {
    area: 'routing',
    complete: true,
    id: 1,
    impact: 8,
    label: 'Route shell',
    owner: 'Router',
    priority: 'high',
    summary: 'Sticky navigation, lazy route content, and suspended panels.',
  },
  {
    area: 'state',
    complete: true,
    id: 2,
    impact: 9,
    label: 'Reactive graph',
    owner: 'Signals',
    priority: 'high',
    summary: 'Derived metrics, keyed lists, swaps, and watcher traces.',
  },
  {
    area: 'api',
    complete: false,
    id: 3,
    impact: 7,
    label: 'Result pipeline',
    owner: 'Services',
    priority: 'medium',
    summary: 'Typed fetchers decode responses before the UI can consume them.',
  },
  {
    area: 'ui',
    complete: false,
    id: 4,
    impact: 6,
    label: 'Shared component contract',
    owner: 'Design',
    priority: 'medium',
    summary: 'Reusable panels accept normalized props and reactive values.',
  },
  {
    area: 'api',
    complete: false,
    id: 5,
    impact: 5,
    label: 'Async recovery',
    owner: 'Services',
    priority: 'low',
    summary: 'Loading, empty, and error states stay explicit per surface.',
  },
]

const areaLabels: Record<AreaFilter, string> = {
  all: 'All',
  api: 'API',
  routing: 'Routing',
  state: 'State',
  ui: 'UI',
}

const DashboardPage: RouteComponent = () => {
  const items = reactive(workstreams)
  const activeArea = reactive<AreaFilter>('all')
  const activity = reactive<Array<string>>(['Dashboard rebuilt from scratch'])

  const visibleItems = derived(() =>
    items.value.filter(
      item => activeArea.value === 'all' || item.area === activeArea.value,
    ),
  )
  const completedCount = derived(
    () => items.value.filter(item => item.complete).length,
  )
  const openImpact = derived(() =>
    items.value
      .filter(item => !item.complete)
      .reduce((total, item) => total + item.impact, 0),
  )
  const readiness = derived(() =>
    Math.round((completedCount.value / items.value.length) * 100),
  )
  const activeScope = derived(() => areaLabels[activeArea.value])
  const priorityFocus = derived(() => {
    const urgentItem = visibleItems.value.find(
      item => !item.complete && item.priority === 'high',
    )

    return urgentItem?.label ?? 'No high priority gaps'
  })
  const rows = derived(() =>
    visibleItems.value.map(item => ({
      component: WorkstreamCard({
        item,
        onToggle: (next: boolean) => {
          items.value = items.value.map(entry =>
            entry.id === item.id ? { ...entry, complete: next } : entry,
          )
          activity.value = [
            `${item.label} marked ${next ? 'complete' : 'open'}`,
            ...activity.value,
          ]
        },
      }),
      key: item.id,
    })),
  )
  const activityRows = derived(() =>
    activity.value.slice(0, 6).map((entry, index) => ({
      component: html`
        <li class="rounded border border-zinc-800 bg-zinc-950 px-3 py-2">
          ${entry}
        </li>
      `,
      key: `${entry}-${index}`,
    })),
  )

  watch(
    readiness,
    next => {
      activity.value = [`Readiness recalculated to ${next}%`, ...activity.value]
    },
    { immediate: true },
  )

  const selectArea = (next: AreaFilter) => {
    activeArea.value = next
    activity.value = [`Scope changed to ${areaLabels[next]}`, ...activity.value]
  }

  return html`
    <div class="space-y-6">
      <section
        class="grid gap-6 rounded border border-zinc-800 bg-zinc-900/80 p-5 shadow-2xl shadow-black/20 lg:grid-cols-[1fr_360px]"
      >
        ${SectionTitle({
          copy: 'A fresh ben-js dashboard that keeps the framework primitives visible: normalized component props, derived metrics, keyed rendering, swaps, watchers, and stateful controls.',
          eyebrow: 'Systems overview',
          title: 'ben-js launch console',
        })}
        <div class="grid content-start gap-3 sm:grid-cols-3 lg:grid-cols-1">
          ${Metric({
            label: 'Readiness',
            tone: 'text-emerald-300',
            value: derived(() => `${readiness.value}%`),
          })}
          ${Metric({
            label: 'Open impact',
            tone: 'text-amber-300',
            value: openImpact,
          })}
          ${Metric({
            label: 'Active scope',
            value: activeScope,
          })}
        </div>
      </section>

      <section class="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div class="std-panel">
          <div class="mb-5 flex flex-wrap items-start justify-between gap-3">
            <div>
              <p
                class="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-cyan-300"
              >
                Keyed workstreams
              </p>
              <h2 class="m-0 text-2xl font-black">Release board</h2>
              <p class="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
                ${priorityFocus}
              </p>
            </div>
            <div class="flex flex-wrap gap-2">
              ${AreaButton({
                activeArea,
                area: 'all',
                onSelect: selectArea,
              })}
              ${AreaButton({
                activeArea,
                area: 'routing',
                onSelect: selectArea,
              })}
              ${AreaButton({
                activeArea,
                area: 'state',
                onSelect: selectArea,
              })}
              ${AreaButton({
                activeArea,
                area: 'api',
                onSelect: selectArea,
              })}
              ${AreaButton({
                activeArea,
                area: 'ui',
                onSelect: selectArea,
              })}
            </div>
          </div>

          <div class="mb-5 h-3 overflow-hidden rounded bg-zinc-800">
            <div
              class="h-full rounded bg-emerald-300 transition-all"
              style="${() => `width: ${readiness.value}%`}"
            ></div>
          </div>

          ${Swap(() => WorkstreamList(visibleItems.value.length > 0, rows))}
        </div>

        <aside class="grid gap-6">
          <div class="std-panel">
            <p
              class="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-cyan-300"
            >
              Snapshot
            </p>
            <h2 class="m-0 mb-4 text-2xl font-black">Runtime shape</h2>
            <div class="grid gap-3">
              ${SignalLine({
                label: 'Derived rows',
                value: derived(() => String(visibleItems.value.length)),
              })}
              ${SignalLine({
                label: 'Completed',
                value: derived(
                  () => `${completedCount.value} / ${items.value.length}`,
                ),
              })}
              ${SignalLine({
                label: 'Watcher events',
                value: derived(() => String(activity.value.length)),
              })}
            </div>
          </div>

          <div class="std-panel">
            <p
              class="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-cyan-300"
            >
              Watch trace
            </p>
            <h2 class="m-0 mb-4 text-2xl font-black">Activity</h2>
            ${Swap(() => Activity(activity.value.length > 0, activityRows))}
          </div>
        </aside>
      </section>
    </div>
  `
}

export default DashboardPage

type AreaButtonProps = {
  activeArea: AreaFilter
  area: AreaFilter
  onSelect: (area: AreaFilter) => void
}

const AreaButton = (props: Props<AreaButtonProps>) => {
  const { activeArea, area, onSelect } = normalize(props)
  const className = derived(() =>
    activeArea.value === area.value
      ? 'border-cyan-200 bg-cyan-200'
      : 'bg-zinc-100',
  )

  return Button(
    {
      class: className,
      onClick: () => onSelect.value(area.value),
    },
    areaLabels[area.value],
  )
}

type WorkstreamCardProps = {
  item: Workstream
  onToggle: (next: boolean) => void
}

const WorkstreamCard = (props: Props<WorkstreamCardProps>) => {
  const { item, onToggle } = normalize(props)

  return html`
    <article
      class="grid gap-4 rounded border border-zinc-800 bg-zinc-950 p-4 md:grid-cols-[1fr_auto]"
    >
      <div>
        <div class="mb-3 flex flex-wrap items-center gap-2">
          ${StatusPill({
            label: item.value.area,
            tone: item.value.area === 'api' ? 'amber' : 'cyan',
          })}
          ${StatusPill({
            label: item.value.priority,
            tone: item.value.priority === 'high' ? 'emerald' : 'zinc',
          })}
          <span
            class="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500"
          >
            impact ${item.value.impact}
          </span>
        </div>
        <h3 class="m-0 text-lg font-black">${item.value.label}</h3>
        <p class="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
          ${item.value.summary}
        </p>
        <p
          class="mt-3 text-xs font-bold uppercase tracking-[0.18em] text-zinc-500"
        >
          ${item.value.owner}
        </p>
      </div>
      <div class="flex items-start md:justify-end">
        ${Button(
          { onClick: () => onToggle.value(!item.value.complete) },
          Icon({
            color: item.value.complete ? '#6ee7b7' : '#fca5a5',
            name: item.value.complete ? IconName.TICK : IconName.CROSS,
            size: 18,
          }),
        )}
      </div>
    </article>
  `
}

type StatusPillProps = {
  label: string
  tone: 'amber' | 'cyan' | 'emerald' | 'zinc'
}

const StatusPill = (props: Props<StatusPillProps>) => {
  const { label, tone } = normalize(props)
  const className = derived(() => {
    if (tone.value === 'amber') {
      return 'border-amber-300/30 bg-amber-300/10 text-amber-200'
    }

    if (tone.value === 'emerald') {
      return 'border-emerald-300/30 bg-emerald-300/10 text-emerald-200'
    }

    if (tone.value === 'zinc') {
      return 'border-zinc-700 bg-zinc-900 text-zinc-300'
    }

    return 'border-cyan-300/30 bg-cyan-300/10 text-cyan-200'
  })

  return html`
    <span
      class="inline-flex min-h-7 items-center rounded border px-2 text-xs font-black uppercase tracking-[0.18em] ${className}"
    >
      ${label}
    </span>
  `
}

type SignalLineProps = {
  label: string
  value: string
}

const SignalLine = (props: Props<SignalLineProps>) => {
  const { label, value } = normalize(props)

  return html`
    <div
      class="flex items-center justify-between gap-3 rounded border border-zinc-800 bg-zinc-950 px-3 py-2"
    >
      <span class="text-sm font-semibold text-zinc-400">${label}</span>
      <span class="font-black text-white">${value}</span>
    </div>
  `
}

const WorkstreamList = (
  hasItems: boolean,
  rows: Reactive<Array<KeyedComponent>>,
) =>
  hasItems
    ? html`<div class="grid gap-3">${List(rows)}</div>`
    : html`<p class="text-zinc-400">No workstreams match this scope.</p>`

const Activity = (
  hasActivity: boolean,
  activityRows: Reactive<Array<KeyedComponent>>,
) =>
  hasActivity
    ? html`<ul class="unstyled-list grid gap-2 text-sm text-zinc-300">
        ${List(activityRows)}
      </ul>`
    : html`<p class="text-zinc-400">No activity recorded yet.</p>`
