export type NamedAPIResource = {
  name: string
  url: string
}

export type Pokemon = {
  abilities: Array<PokemonAbility>
  base_experience: number
  cries: PokemonCries
  forms: Array<NamedAPIResource>
  game_indices: Array<VersionGameIndex>
  height: number
  held_items: Array<PokemonHeldItem>
  id: number

  is_default: boolean
  location_area_encounters: string
  moves: Array<PokemonMove>
  name: string
  order: number
  past_abilities: Array<PokemonPastAbility>
  past_stats: Array<PokemonPastStat>
  past_types: Array<PokemonPastType>
  species: NamedAPIResource
  sprites: PokemonSprites
  stats: Array<PokemonStat>
  types: Array<PokemonType>
  weight: number
}

export type PokemonAbility = {
  ability: NamedAPIResource
  is_hidden: boolean
  slot: number
}

export type PokemonCries = {
  latest: string
  legacy: string
}

export type PokemonHeldItem = {
  item: NamedAPIResource
  version_details: Array<PokemonHeldItemVersion>
}

export type PokemonHeldItemVersion = {
  rarity: number
  version: NamedAPIResource
}

export type PokemonMove = {
  move: NamedAPIResource
  version_group_details: Array<PokemonMoveVersion>
}

export type PokemonMoveVersion = {
  level_learned_at: number
  move_learn_method: NamedAPIResource
  order: number | null
  version_group: NamedAPIResource
}

export type PokemonPastAbility = {
  abilities: Array<{
    ability: NamedAPIResource | null
    is_hidden: boolean
    slot: number
  }>
  generation: NamedAPIResource
}

export type PokemonPastStat = {
  generation: NamedAPIResource
  stats: Array<PokemonStat>
}

export type PokemonPastType = {
  generation: NamedAPIResource
  types: Array<PokemonType>
}

export type PokemonSprites = {
  back_default: string | null
  back_female: string | null
  back_shiny: string | null
  back_shiny_female: string | null
  front_default: string | null
  front_female: string | null
  front_shiny: string | null
  front_shiny_female: string | null
  other: Record<string, SpriteSet>
  versions: Record<string, Record<string, SpriteSet>>
}

export type PokemonStat = {
  base_stat: number
  effort: number
  stat: NamedAPIResource
}

export type PokemonType = {
  slot: number
  type: NamedAPIResource
}

export type SpriteSet = {
  animated?: SpriteSet
  back_default?: string | null
  back_female?: string | null
  back_gray?: string | null
  back_shiny?: string | null
  back_shiny_female?: string | null
  back_shiny_transparent?: string | null

  back_transparent?: string | null
  front_default?: string | null
  front_female?: string | null
  front_gray?: string | null
  front_shiny?: string | null
  front_shiny_female?: string | null
  front_shiny_transparent?: string | null

  front_transparent?: string | null
}

export type VersionGameIndex = {
  game_index: number
  version: NamedAPIResource
}
