import { type RouteComponent } from '@ben-js/router'
import { html } from 'ben-js'

import { type Pokemon } from '~/lib/types/pokeapi'
import { type Result } from '~/lib/types/result'
import { capitalize } from '~/lib/utils/capitalize'
import { refetch } from '~/lib/utils/refetch'

const PokemonPage: RouteComponent = async ctx => {
  if (!ctx.slug) {
    return html`
      <div class="std-container">
        <h1>No Pokemon name provided</h1>
        <p>Please provide a Pokemon name in the URL slug.</p>
      </div>
    `
  }

  const [pokemon, error] = await fetchPokemon(ctx.slug)

  if (error) {
    return html`
      <div class="std-container">
        <h1>Error</h1>
        <p>${error.message}</p>
      </div>
    `
  }

  return html`
    <div class="std-container">
      <h1>${capitalize(pokemon.name)}</h1>
      <img
        src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png"
      />
    </div>
  `
}

export default PokemonPage

const fetchPokemon = async (name: string): Promise<Result<Pokemon>> =>
  refetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
