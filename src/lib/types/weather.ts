export type WeatherForecast = {
  current: {
    interval: number
    temperature_2m: number
    time: string
    wind_speed_10m: number
  }
  current_units: {
    temperature_2m: string
    wind_speed_10m: string
  }
  daily: {
    temperature_2m_max: Array<number>
    temperature_2m_min: Array<number>
    time: Array<string>
  }
  timezone: string
}
