import { createUrl, requestJson } from '~/lib/services/json-client'
import {
  type NamedAPIResource,
  type Pokemon,
  type PokemonAbility,
  type PokemonCries,
  type PokemonHeldItem,
  type PokemonMove,
  type PokemonPastAbility,
  type PokemonPastStat,
  type PokemonPastType,
  type PokemonSprites,
  type PokemonStat,
  type PokemonType,
  type SpriteSet,
  type VersionGameIndex,
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

const isAbility = (value: unknown): value is PokemonAbility =>
  isRecord(value) &&
  isNamedAPIResource(value.ability) &&
  isBoolean(value.is_hidden) &&
  isNumber(value.slot)

const isCries = (value: unknown): value is PokemonCries =>
  isRecord(value) && isString(value.latest) && isString(value.legacy)

const isHeldItem = (value: unknown): value is PokemonHeldItem =>
  isRecord(value) &&
  isNamedAPIResource(value.item) &&
  isArrayOf(isHeldItemVersion)(value.version_details)

const isHeldItemVersion = (
  value: unknown,
): value is PokemonHeldItem['version_details'][number] =>
  isRecord(value) && isNumber(value.rarity) && isNamedAPIResource(value.version)

const isMove = (value: unknown): value is PokemonMove =>
  isRecord(value) &&
  isNamedAPIResource(value.move) &&
  isArrayOf(isMoveVersionGroupDetail)(value.version_group_details)

const isMoveVersionGroupDetail = (
  value: unknown,
): value is PokemonMove['version_group_details'][number] =>
  isRecord(value) &&
  isNumber(value.level_learned_at) &&
  isNamedAPIResource(value.move_learn_method) &&
  isNullableNumber(value.order) &&
  isNamedAPIResource(value.version_group)

const isPastAbility = (value: unknown): value is PokemonPastAbility =>
  isRecord(value) &&
  isArrayOf(isPastAbilityEntry)(value.abilities) &&
  isNamedAPIResource(value.generation)

const isPastAbilityEntry = (
  value: unknown,
): value is PokemonPastAbility['abilities'][number] =>
  isRecord(value) &&
  (value.ability === null || isNamedAPIResource(value.ability)) &&
  isBoolean(value.is_hidden) &&
  isNumber(value.slot)

const isPastStat = (value: unknown): value is PokemonPastStat =>
  isRecord(value) &&
  isNamedAPIResource(value.generation) &&
  isArrayOf(isStat)(value.stats)

const isPastType = (value: unknown): value is PokemonPastType =>
  isRecord(value) &&
  isNamedAPIResource(value.generation) &&
  isArrayOf(isPokemonType)(value.types)

const isSprites = (value: unknown): value is PokemonSprites =>
  isRecord(value) &&
  isNullableString(value.back_default) &&
  isNullableString(value.back_female) &&
  isNullableString(value.back_shiny) &&
  isNullableString(value.back_shiny_female) &&
  isNullableString(value.front_default) &&
  isNullableString(value.front_female) &&
  isNullableString(value.front_shiny) &&
  isNullableString(value.front_shiny_female) &&
  isSpriteSetMap(value.other) &&
  isSpriteVersionMap(value.versions)

const isSpriteSetMap = (value: unknown): value is Record<string, SpriteSet> =>
  isRecord(value) && Object.values(value).every(isSpriteSet)

const isSpriteVersionMap = (
  value: unknown,
): value is PokemonSprites['versions'] =>
  isRecord(value) && Object.values(value).every(isSpriteSetMap)

const spriteStringKeys = [
  'back_default',
  'back_female',
  'back_gray',
  'back_shiny',
  'back_shiny_female',
  'back_shiny_transparent',
  'back_transparent',
  'front_default',
  'front_female',
  'front_gray',
  'front_shiny',
  'front_shiny_female',
  'front_shiny_transparent',
  'front_transparent',
] as const

const isSpriteSet = (value: unknown): value is SpriteSet =>
  isRecord(value) &&
  spriteStringKeys.every(key =>
    value[key] === undefined ? true : isNullableString(value[key]),
  ) &&
  (value.animated === undefined || isSpriteSet(value.animated))

const isStat = (value: unknown): value is PokemonStat =>
  isRecord(value) &&
  isNumber(value.base_stat) &&
  isNumber(value.effort) &&
  isNamedAPIResource(value.stat)

const isPokemonType = (value: unknown): value is PokemonType =>
  isRecord(value) && isNumber(value.slot) && isNamedAPIResource(value.type)

const isVersionGameIndex = (value: unknown): value is VersionGameIndex =>
  isRecord(value) &&
  isNumber(value.game_index) &&
  isNamedAPIResource(value.version)

const isNullableNumber = (value: unknown): value is number | null =>
  value === null || isNumber(value)

const isPokemon = (value: unknown): value is Pokemon =>
  isRecord(value) &&
  isArrayOf(isAbility)(value.abilities) &&
  isNumber(value.base_experience) &&
  isCries(value.cries) &&
  isArrayOf(isNamedAPIResource)(value.forms) &&
  isArrayOf(isVersionGameIndex)(value.game_indices) &&
  isNumber(value.height) &&
  isArrayOf(isHeldItem)(value.held_items) &&
  isNumber(value.id) &&
  isBoolean(value.is_default) &&
  isString(value.location_area_encounters) &&
  isArrayOf(isMove)(value.moves) &&
  isString(value.name) &&
  isNumber(value.order) &&
  isArrayOf(isPastAbility)(value.past_abilities) &&
  isArrayOf(isPastStat)(value.past_stats) &&
  isArrayOf(isPastType)(value.past_types) &&
  isNamedAPIResource(value.species) &&
  isSprites(value.sprites) &&
  isArrayOf(isStat)(value.stats) &&
  isArrayOf(isPokemonType)(value.types) &&
  isNumber(value.weight)
