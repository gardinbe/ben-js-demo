import { html, List, normalize, type Props, ref, Swap } from '@ben-js/core'
import { derived, reactive } from '@ben-js/reactivity'
import { type RouteComponent } from '@ben-js/router'

import { BaseButton, Button } from '~/lib/components/Button'
import { Metric } from '~/lib/components/Metric'
import { SectionTitle } from '~/lib/components/SectionTitle'
import {
  applyRequestResult,
  createRequestState,
  fetchPokemon,
  getRequestStatus,
} from '~/lib/services'
import { type Pokemon } from '~/lib/types/pokeapi'
import { capitalize } from '~/lib/utils/capitalize'

type PokemonHistoryItem = {
  id: number
  name: string
  sprite: string | null
  types: string
  onClick: () => void
}

const PokemonLabPage: RouteComponent = () => {
  const input = ref<HTMLInputElement>()
  const query = reactive('')
  const state = reactive(createRequestState<Pokemon>())
  const history = reactive<Array<PokemonHistoryItem>>([])
  const status = derived(() => getRequestStatus(state.value))

  const historyRows = derived(() =>
    history.value.map(item => ({
      component: PokemonHistoryButton(item),
      key: item.id,
    })),
  )

  const loadPokemon = async () => {
    const name = query.value.trim()

    if (!name) {
      state.value = {
        ...state.value,
        error: 'Enter a Pokemon name or id.',
        loading: false,
      }
      return
    }

    state.value = { ...state.value, error: null, loading: true }
    const result = await fetchPokemon(name)
    state.value = applyRequestResult(result, state.value)

    const [pokemon] = result

    if (pokemon) {
      history.value = [
        {
          id: pokemon.id,
          name: pokemon.name,
          sprite: pokemon.sprites.front_default,
          types: pokemon.types.map(entry => entry.type.name).join(' / '),
          onClick: () => {
            void search(pokemon.name)
          },
        },
        ...history.value.filter(item => item.id !== pokemon.id),
      ].slice(0, 6)
    }
  }

  const search = async (value: string) => {
    query.value = value

    if (input.el) {
      input.el.value = value
    }

    await loadPokemon()
  }

  input.on('input', () => {
    query.value = input.el?.value ?? ''
  })

  input.on('keydown', ev => {
    if (ev.key === 'Enter') {
      void loadPokemon()
    }
  })

  void search('pikachu')

  return html`
    <div class="space-y-6">
      <section class="std-panel">
        ${SectionTitle({
          copy: 'A typed PokeAPI explorer using the copied response shape, decoded JSON payloads, and tuple Result handling for each request.',
          eyebrow: 'PokeAPI',
          title: 'Pokemon telemetry lab',
        })}
        <div class="mt-6 flex flex-wrap gap-3">
          <input
            ref="${input}"
            class="std-field min-w-64"
            placeholder="pikachu, ditto, 25..."
            value="${query}"
          />
          ${Button({ onClick: loadPokemon }, 'Fetch Pokemon')}
          ${Button(
            {
              onClick: () => {
                void search('mewtwo')
              },
            },
            'Try mewtwo',
          )}
        </div>
      </section>

      <section class="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <aside class="std-panel">
          <p
            class="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-cyan-300"
          >
            State machine
          </p>
          <h2 class="m-0 mb-4 text-2xl font-black">${status}</h2>
          ${Swap(() =>
            PokemonState(
              state.value.data,
              state.value.error,
              state.value.loading,
            ),
          )}
        </aside>

        <div class="std-panel">
          <div class="mb-4 flex items-center justify-between gap-3">
            <h2 class="m-0 text-2xl font-black">Battle stats</h2>
            <span class="std-badge"
              >${() => state.value.data?.types[0]?.type.name ?? 'waiting'}</span
            >
          </div>
          <div class="grid gap-3">
            ${List(
              () =>
                state.value.data?.stats.map(stat => ({
                  component: html`
                    <div
                      class="grid grid-cols-[110px_1fr_44px] items-center gap-3 text-sm"
                    >
                      <span class="font-semibold text-zinc-300"
                        >${stat.stat.name}</span
                      >
                      <span class="h-2 overflow-hidden rounded bg-zinc-800">
                        <span
                          class="block h-full rounded bg-cyan-300"
                          style="width: ${Math.min(100, stat.base_stat)}%"
                        ></span>
                      </span>
                      <span class="text-right font-bold text-white"
                        >${stat.base_stat}</span
                      >
                    </div>
                  `,
                  key: stat.stat.name,
                })) ?? [],
            )}
          </div>
        </div>
      </section>

      <section class="std-panel">
        <h2 class="m-0 mb-4 text-2xl font-black">Recent lookups</h2>
        ${Swap(() =>
          history.value.length > 0
            ? html`<div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
                ${List(historyRows)}
              </div>`
            : html`<p class="text-zinc-400">
                Search results will collect here.
              </p>`,
        )}
      </section>
    </div>
  `
}

export default PokemonLabPage

const PokemonState = (
  pokemon: Pokemon | null,
  error: string | null,
  loading: boolean,
) => {
  if (loading) {
    return html`<p class="text-cyan-200">Fetching from PokeAPI...</p>`
  }

  if (error) {
    return html`<p
      class="rounded border border-red-500/50 bg-red-950/40 p-3 text-red-200"
    >
      ${error}
    </p>`
  }

  if (!pokemon) {
    return html`<p class="text-zinc-400">No Pokemon loaded yet.</p>`
  }

  return html`
    <div class="space-y-4">
      <img
        class="mx-auto h-52 object-contain"
        src="${pokemon.sprites.other?.['official-artwork']?.front_default ??
        pokemon.sprites.front_default ??
        ''}"
        alt="${pokemon.name}"
      />
      <div>
        <h3 class="m-0 text-3xl font-black">${capitalize(pokemon.name)}</h3>
        <p class="text-zinc-400">
          #${pokemon.id} /
          ${pokemon.types.map(entry => entry.type.name).join(', ')}
        </p>
      </div>
      <div class="grid grid-cols-3 gap-3">
        ${Metric({ label: 'Height', value: pokemon.height })}
        ${Metric({ label: 'Weight', value: pokemon.weight })}
        ${Metric({ label: 'Moves', value: pokemon.moves.length })}
      </div>
    </div>
  `
}

const PokemonHistoryButton = (props: Props<PokemonHistoryItem>) => {
  const { name, onClick, sprite, types } = normalize(props)
  const button = ref<HTMLButtonElement>()

  button.on('click', () => {
    onClick.value()
  })

  return BaseButton(
    {
      class:
        'rounded border border-zinc-800 bg-zinc-950 p-3 text-left hover:border-cyan-400',
    },
    html`
      <img
        class="mb-2 size-16 object-contain"
        src="${sprite ?? ''}"
        alt=""
      />
      <span class="block font-bold">${() => capitalize(name.value)}</span>
      <span class="text-xs text-zinc-500">${types}</span>
    `,
  )
}
