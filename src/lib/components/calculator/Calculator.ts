import { html, reactive } from 'ben-js'

import { CalculatorBtn } from '~/lib/components/calculator/CalculatorBtn'

export const Calculator = () => {
  const prevValue = reactive(0)
  const nextValue = reactive(0)
  const awaitingInput = reactive(true)
  const display = reactive(EmptyDisplay)

  let currentOperation: Operation | null = null

  const exec = (): number =>
    currentOperation?.(prevValue.value, nextValue.value) ?? nextValue.value

  const load = (operation: Operation) => {
    prevValue.value = exec()
    nextValue.value = 0
    awaitingInput.value = true
    display.value = `${prevValue.value}`
    currentOperation = operation
  }

  const finish = () => {
    nextValue.value = exec()
    prevValue.value = 0
    awaitingInput.value = true
    display.value = `${nextValue.value}`
    currentOperation = null
  }

  const reset = () => {
    prevValue.value = 0
    nextValue.value = 0
    awaitingInput.value = true
    display.value = EmptyDisplay
    currentOperation = null
  }

  const append = (char: string) => {
    if (awaitingInput.value) {
      display.value = ''
      awaitingInput.value = false
    }

    display.value = display.value + char
    nextValue.value = Number.parseFloat(display.value)
  }

  return html`
    <div
      class="w-full flex-1 flex flex-col gap-4 p-4 bg-gray-800 sm:flex-0 sm:w-96"
    >
      <div class="p-6 bg-gray-700 text-2xl font-bold sm:p-3">${display}</div>
      <div class="flex-1 grid grid-cols-4 gap-2 sm:auto-rows-[--spacing(12)]">
        ${CalculatorBtn(
          {
            type: 'number',
            onClick: () => {
              append('7')
            },
          },
          '7',
        )}
        ${CalculatorBtn(
          {
            type: 'number',
            onClick: () => {
              append('8')
            },
          },
          '8',
        )}
        ${CalculatorBtn(
          {
            type: 'number',
            onClick: () => {
              append('9')
            },
          },
          '9',
        )}
        ${CalculatorBtn(
          {
            type: 'operation',
            onClick: () => {
              load((prev, next) => prev / next)
            },
          },
          '/',
        )}
        ${CalculatorBtn(
          {
            type: 'number',
            onClick: () => {
              append('4')
            },
          },
          '4',
        )}
        ${CalculatorBtn(
          {
            type: 'number',
            onClick: () => {
              append('5')
            },
          },
          '5',
        )}
        ${CalculatorBtn(
          {
            type: 'number',
            onClick: () => {
              append('6')
            },
          },
          '6',
        )}
        ${CalculatorBtn(
          {
            type: 'operation',
            onClick: () => {
              load((prev, next) => prev * next)
            },
          },
          '*',
        )}
        ${CalculatorBtn(
          {
            type: 'number',
            onClick: () => {
              append('1')
            },
          },
          '1',
        )}
        ${CalculatorBtn(
          {
            type: 'number',
            onClick: () => {
              append('2')
            },
          },
          '2',
        )}
        ${CalculatorBtn(
          {
            type: 'number',
            onClick: () => {
              append('3')
            },
          },
          '3',
        )}
        ${CalculatorBtn(
          {
            type: 'operation',
            onClick: () => {
              load((prev, next) => prev - next)
            },
          },
          '-',
        )}
        ${CalculatorBtn(
          {
            type: 'number',
            onClick: () => {
              append('0')
            },
          },
          '0',
        )}
        ${CalculatorBtn(
          {
            type: 'number',
            onClick: () => {
              append('.')
            },
          },
          '.',
        )}
        ${CalculatorBtn(
          {
            type: 'operation',
            onClick: () => {
              reset()
            },
          },
          'C',
        )}
        ${CalculatorBtn(
          {
            type: 'operation',
            onClick: () => {
              load((prev, next) => prev + next)
            },
          },
          '+',
        )}
        ${CalculatorBtn(
          {
            type: 'equals',
            onClick: () => {
              finish()
            },
          },
          '=',
        )}
      </div>
    </div>
  `
}

type Operation = (prev: number, next: number) => number

const EmptyDisplay = '-'
