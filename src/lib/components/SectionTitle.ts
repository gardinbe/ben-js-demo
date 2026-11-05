import { html, normalize, type Props } from '@ben-js/core'

export type SectionTitleProps = {
  copy: string
  eyebrow: string
  title: string
}

export const SectionTitle = (props: Props<SectionTitleProps>) => {
  const { copy, eyebrow, title } = normalize(props)

  return html`
    <div class="max-w-3xl">
      <p
        class="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-cyan-300"
      >
        ${eyebrow}
      </p>
      <h1
        class="mt-0 mb-4 text-4xl font-black leading-tight text-white md:text-6xl"
      >
        ${title}
      </h1>
      <p class="max-w-2xl text-base leading-7 text-zinc-300 md:text-lg">
        ${copy}
      </p>
    </div>
  `
}
