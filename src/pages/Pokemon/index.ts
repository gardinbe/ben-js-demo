import { go, type RouteComponent } from '@ben-js/router'
import { html, reactive, ref } from 'ben-js'

import { Btn } from '~/lib/components/Btn'

const PokemonListPage: RouteComponent = () => {
  const form = ref<HTMLFormElement>()
  const input = ref<HTMLInputElement>()
  const pokemon = reactive('')

  input.on('input', () => {
    pokemon.value = input.el!.value
  })

  form.on('submit', ev => {
    ev.preventDefault()
    go(`/pokemon/${pokemon.value}`)
  })

  return html`
    <div class="std-container">
      <h1>Pokemon</h1>
      <form ref="${form}">
        <input
          ref="${input}"
          type="text"
          placeholder="Pokemon name..."
        />
        ${Btn({ type: 'submit' }, 'Search')}
      </form>
    </div>
  `
}

export default PokemonListPage
