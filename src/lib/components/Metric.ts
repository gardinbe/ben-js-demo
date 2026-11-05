import { html, normalize, type Props } from '@ben-js/core'
import { derived } from '@ben-js/reactivity'

export type MetricProps = {
  label: string
  value: unknown
  tone?: string
}

export const Metric = (props: Props<MetricProps>) => {
  const { label, tone, value } = normalize(props)
  const toneClass = derived(() => tone?.value ?? 'text-cyan-200')

  return html`
    <div class="rounded border border-zinc-800 bg-zinc-900/70 p-4">
      <p
        class="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500"
      >
        ${label}
      </p>
      <p class="text-2xl font-black ${toneClass}">${value}</p>
    </div>
  `
}
