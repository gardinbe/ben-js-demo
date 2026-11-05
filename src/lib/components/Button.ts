import { html, normalize, type Props, ref } from '@ben-js/core'

export type ButtonProps = BaseButtonProps

export const Button = (props: Props<ButtonProps>, slot: unknown) =>
  BaseButton(
    {
      ...props,
      class: 'std-button',
    },
    slot,
  )

export type BaseButtonProps = {
  class?: string
  disabled?: boolean
  type?: 'button' | 'reset' | 'submit'
  onClick?: (ev: MouseEvent) => void
}

export const BaseButton = (props: Props<ButtonProps>, slot: unknown) => {
  const { class: className, onClick, type } = normalize(props)
  const button = ref<HTMLButtonElement>()

  button.on('click', ev => {
    onClick?.value?.(ev)
  })

  return html`
    <button
      ref="${button}"
      class="${className}"
      type="${() => type?.value ?? 'button'}"
    >
      ${slot}
    </button>
  `
}
