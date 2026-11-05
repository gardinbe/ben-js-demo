import { html, normalize, type Props } from '@ben-js/core'

import { type IconSvgProps } from './Cross'

export const Tick = (props: Props<IconSvgProps>) => {
  const { color, size } = normalize(props)

  return html`
    <svg
      aria-hidden="true"
      fill="currentcolor"
      height="${size}"
      style="color: ${color}"
      viewBox="0 0 24 24"
      width="${size}"
    >
      <path d="m9.2 16.8-4.4-4.4 1.5-1.5 2.9 2.9 8.5-8.5 1.5 1.5z"></path>
    </svg>
  `
}
