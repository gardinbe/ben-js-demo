import { html, normalize, type Props } from '@ben-js/core'

export type IconSvgProps = {
  color: string
  size: number | string
}

export const Cross = (props: Props<IconSvgProps>) => {
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
      <path
        d="M6.4 4.9 12 10.5l5.6-5.6 1.5 1.5-5.6 5.6 5.6 5.6-1.5 1.5-5.6-5.6-5.6 5.6-1.5-1.5 5.6-5.6-5.6-5.6z"
      ></path>
    </svg>
  `
}
