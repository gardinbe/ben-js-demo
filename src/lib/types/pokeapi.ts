export type Ability = {
  ability: NamedAPIResource
  is_hidden: boolean
  slot: number
}

export type Move = {
  move: NamedAPIResource
  version_group_details: Array<{
    level_learned_at: number
    move_learn_method: NamedAPIResource
    version_group: NamedAPIResource
  }>
}

export type NamedAPIResource = {
  name: string
  url: string
}

export type Pokemon = {
  abilities: Array<Ability>
  base_experience: number
  forms: Array<NamedAPIResource>
  height: number
  id: number
  is_default: boolean
  moves: Array<Move>
  name: string
  order: number
  species: NamedAPIResource
  sprites: Sprites
  stats: Array<Stat>
  types: Array<Type>
  weight: number
}

export type Sprites = {
  back_default: string | null
  back_female: string | null
  back_shiny: string | null
  back_shiny_female: string | null
  front_default: string | null
  front_female: string | null
  front_shiny: string | null
  front_shiny_female: string | null
  other?: {
    [key: string]: {
      front_default: string | null
      front_shiny: string | null
    }
  }
}

export type Stat = {
  base_stat: number
  effort: number
  stat: NamedAPIResource
}

export type Type = {
  slot: number
  type: NamedAPIResource
}
