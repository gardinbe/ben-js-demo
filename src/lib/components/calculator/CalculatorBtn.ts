import {
  type Component,
  derived,
  html,
  normalize,
  type Props,
  ref,
} from 'ben-js'

export type CalculatorBtnProps = Props<{
  type: 'equals' | 'number' | 'operation'
  onClick: () => void
}>

export const CalculatorBtn = (
  props: CalculatorBtnProps,
  slot: unknown,
): Component => {
  const { onClick, type } = normalize(props)
  const btn = ref()

  btn.on('click', () => {
    onClick.value()
  })

  return html`
    <button
      ref="${btn}"
      class="text-2xl font-bold cursor-pointer ${derived(() =>
        type.value === 'equals'
          ? 'bg-blue-800 hover:bg-blue-700 active:bg-blue-600'
          : type.value === 'operation'
            ? 'bg-orange-800 hover:bg-orange-700 active:bg-orange-600'
            : 'bg-gray-800 hover:bg-gray-700 active:bg-gray-600',
      )}"
    >
      ${slot}
    </button>
  `
}
