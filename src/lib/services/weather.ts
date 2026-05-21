import { createUrl, requestJson } from '~/lib/services/json-client'
import { type WeatherForecast } from '~/lib/types/weather'
import { isArrayOf, isNumber, isRecord, isString } from '~/lib/utils/predicates'
import { type Result } from '~/lib/utils/result'

export const fetchWeather = (
  latitude: number,
  longitude: number,
): Promise<Result<WeatherForecast>> =>
  requestJson(
    {
      decoderError: 'Open-Meteo returned an unexpected forecast payload',
      url: createUrl('https://api.open-meteo.com/v1/', ['forecast'], {
        current: 'temperature_2m,wind_speed_10m',
        daily: 'temperature_2m_max,temperature_2m_min',
        latitude,
        longitude,
        timezone: 'auto',
      }),
    },
    isWeatherForecast,
  )

const isWeatherForecast = (value: unknown): value is WeatherForecast =>
  isRecord(value) &&
  isWeatherCurrent(value.current) &&
  isWeatherCurrentUnits(value.current_units) &&
  isWeatherDaily(value.daily) &&
  isString(value.timezone)

const isWeatherCurrent = (
  value: unknown,
): value is WeatherForecast['current'] =>
  isRecord(value) &&
  isNumber(value.interval) &&
  isNumber(value.temperature_2m) &&
  isString(value.time) &&
  isNumber(value.wind_speed_10m)

const isWeatherCurrentUnits = (
  value: unknown,
): value is WeatherForecast['current_units'] =>
  isRecord(value) &&
  isString(value.temperature_2m) &&
  isString(value.wind_speed_10m)

const isWeatherDaily = (value: unknown): value is WeatherForecast['daily'] =>
  isRecord(value) &&
  isArrayOf(isNumber)(value.temperature_2m_max) &&
  isArrayOf(isNumber)(value.temperature_2m_min) &&
  isArrayOf(isString)(value.time)
