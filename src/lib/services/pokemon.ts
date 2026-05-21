import { createUrl, requestJson } from '~/lib/services/json-client'
import {
  type Ability,
  type Move,
  type NamedAPIResource,
  type Pokemon,
  type Sprites,
  type Stat,
  type Type,
} from '~/lib/types/pokeapi'
import {
  isArrayOf,
  isBoolean,
  isNullableString,
  isNumber,
  isRecord,
  isString,
} from '~/lib/utils/predicates'
import { type Result } from '~/lib/utils/result'

export const fetchPokemon = (name: string): Promise<Result<Pokemon>> =>
  requestJson(
    {
      decoderError: 'PokeAPI returned an unexpected Pokemon payload',
      url: createUrl('https://pokeapi.co/api/v2/', [
        'pokemon',
        name.trim().toLowerCase(),
      ]),
    },
    isPokemon,
  )

const isNamedAPIResource = (value: unknown): value is NamedAPIResource =>
  isRecord(value) && isString(value.name) && isString(value.url)

const isAbility = (value: unknown): value is Ability =>
  isRecord(value) &&
  isNamedAPIResource(value.ability) &&
  isBoolean(value.is_hidden) &&
  isNumber(value.slot)

const isMove = (value: unknown): value is Move =>
  isRecord(value) &&
  isNamedAPIResource(value.move) &&
  isArrayOf(isMoveVersionGroupDetail)(value.version_group_details)

const isMoveVersionGroupDetail = (
  value: unknown,
): value is Move['version_group_details'][number] =>
  isRecord(value) &&
  isNumber(value.level_learned_at) &&
  isNamedAPIResource(value.move_learn_method) &&
  isNamedAPIResource(value.version_group)

const isSprites = (value: unknown): value is Sprites =>
  isRecord(value) &&
  isNullableString(value.back_default) &&
  isNullableString(value.back_female) &&
  isNullableString(value.back_shiny) &&
  isNullableString(value.back_shiny_female) &&
  isNullableString(value.front_default) &&
  isNullableString(value.front_female) &&
  isNullableString(value.front_shiny) &&
  isNullableString(value.front_shiny_female) &&
  (value.other === undefined || isSpriteOtherMap(value.other))

const isSpriteOtherMap = (
  value: unknown,
): value is NonNullable<Sprites['other']> =>
  isRecord(value) && Object.values(value).every(isSpriteOtherEntry)

const isSpriteOtherEntry = (
  value: unknown,
): value is NonNullable<Sprites['other']>[string] =>
  isRecord(value) &&
  isNullableString(value.front_default) &&
  isNullableString(value.front_shiny)

const isStat = (value: unknown): value is Stat =>
  isRecord(value) &&
  isNumber(value.base_stat) &&
  isNumber(value.effort) &&
  isNamedAPIResource(value.stat)

const isPokemonType = (value: unknown): value is Type =>
  isRecord(value) && isNumber(value.slot) && isNamedAPIResource(value.type)

const isPokemon = (value: unknown): value is Pokemon =>
  isRecord(value) &&
  isArrayOf(isAbility)(value.abilities) &&
  isNumber(value.base_experience) &&
  isArrayOf(isNamedAPIResource)(value.forms) &&
  isNumber(value.height) &&
  isNumber(value.id) &&
  isBoolean(value.is_default) &&
  isArrayOf(isMove)(value.moves) &&
  isString(value.name) &&
  isNumber(value.order) &&
  isNamedAPIResource(value.species) &&
  isSprites(value.sprites) &&
  isArrayOf(isStat)(value.stats) &&
  isArrayOf(isPokemonType)(value.types) &&
  isNumber(value.weight)
