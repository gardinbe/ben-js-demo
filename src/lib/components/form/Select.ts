import {
  attrs,
  type Component,
  html,
  List,
  normalize,
  type Props,
  ref,
} from 'ben-js'

export type SelectOption = {
  label: string
  value: string
  default?: boolean
  disabled?: boolean
  selected?: boolean
}

export type SelectProps = Props<{
  label: string
  name: string
  options: Array<SelectOption>
  placeholder: string
  autocomplete?: string
  type?: string
  onUpdate: (value: string) => void
}>

export const Select = (props: SelectProps): Component => {
  const { autocomplete, label, name, onUpdate, options, placeholder, type } =
    normalize(props)

  const select = ref<HTMLSelectElement>()
  const uuid = crypto.randomUUID()

  select.on('input', () => {
    onUpdate.value(select.el!.value)
  })

  return html` <div class="flex flex-col gap-2">
    <label for="${uuid}">${label}</label>
    <select
      ref=${select}
      ${attrs({
        autocomplete: autocomplete ?? 'off',
        class: 'std-input',
        id: uuid,
        name: name,
        placeholder: placeholder,
        type: type ?? 'select-one',
      })}
    >
      ${List(() =>
        options.value.map(option => ({
          component: html`<option
            ${attrs({
              default: option.default,
              disabled: option.disabled,
              selected: option.selected,
              value: option.value,
            })}
          >
            ${option.label}
          </option>`,
          key: option.value,
        })),
      )}
    </select>
  </div>`
}
