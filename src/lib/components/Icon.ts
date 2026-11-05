import { html, normalize, type Props } from '@ben-js/core'

import { type Enum } from '~/lib/utils/types'

import { Cross } from './icons/Cross'
import { Tick } from './icons/Tick'

export type IconName = Enum<typeof IconName>
export const IconName = {
  CROSS: 'cross',
  TICK: 'tick',
} as const

export type IconProps = {
  name: IconName
  color?: string
  size?: number | string
}

export const Icon = (props: Props<IconProps>) => {
  const { color, name, size } = normalize(props)
  const iconProps = {
    color: color?.value ?? 'currentcolor',
    size: size?.value ?? 20,
  }

  if (name.value === IconName.CROSS) {
    return Cross(iconProps)
  }

  if (name.value === IconName.TICK) {
    return Tick(iconProps)
  }

  return html``
}
