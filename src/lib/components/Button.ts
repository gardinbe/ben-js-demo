import { html, normalize, type Props, ref } from 'ben-js'

export type ButtonProps = {
  class?: string
  disabled?: boolean
  type?: 'button' | 'reset' | 'submit'
  onClick?: (ev: MouseEvent) => void
}

export const Button = (props: Props<ButtonProps>, slot: unknown) => {
  const { class: className, onClick, type } = normalize(props)
  const button = ref<HTMLButtonElement>()

  button.on('click', ev => {
    onClick?.value?.(ev)
  })

  return html`
    <button
      ref="${button}"
      class="std-button ${className}"
      type="${type?.value ?? 'button'}"
    >
      ${slot}
    </button>
  `
}
