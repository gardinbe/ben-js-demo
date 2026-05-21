import { html, normalize, type Props } from 'ben-js'

export type LoadingPanelProps = {
  label: string
}

export const LoadingPanel = (props: Props<LoadingPanelProps>) => {
  const { label } = normalize(props)

  return html`
    <section class="std-panel grid min-h-64 place-items-center">
      <div
        class="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200"
      >
        <span class="size-3 animate-ping rounded-full bg-cyan-300"></span>
        ${label}
      </div>
    </section>
  `
}
