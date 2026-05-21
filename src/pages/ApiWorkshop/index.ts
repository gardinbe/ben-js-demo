import { type RouteComponent } from '@ben-js/router'
import { derived, html, List, reactive, Suspended, Swap } from 'ben-js'

import { Button } from '~/lib/components/Button'
import { LoadingPanel } from '~/lib/components/LoadingPanel'
import { Metric } from '~/lib/components/Metric'
import { SectionTitle } from '~/lib/components/SectionTitle'
import {
  applyRequestResult,
  createRequestState,
  fetchAdvice,
  fetchGithubRepo,
  fetchGithubUser,
  fetchWeather,
  getRequestStatus,
  type RequestStatus,
} from '~/lib/services'
import { type AdviceSlip } from '~/lib/types/advice'
import { type GithubRepo, type GithubUser } from '~/lib/types/github'
import { type WeatherForecast } from '~/lib/types/weather'
import { formatDate } from '~/lib/utils/format'
import { unwrap } from '~/lib/utils/result'

const ApiWorkshopPage: RouteComponent = () => {
  const repo = reactive(createRequestState<GithubRepo>())
  const user = reactive(createRequestState<GithubUser>())
  const weather = reactive(createRequestState<WeatherForecast>())
  const advice = reactive(createRequestState<AdviceSlip>())
  const selectedCity = reactive<'london' | 'new-york' | 'tokyo'>('london')
  const statuses = derived<Array<[string, RequestStatus]>>(() => [
    ['GitHub repo', getRequestStatus(repo.value)],
    ['GitHub user', getRequestStatus(user.value)],
    ['Weather', getRequestStatus(weather.value)],
    ['Advice', getRequestStatus(advice.value)],
  ])
  const statusRows = derived(() =>
    statuses.value.map(([label, status]) => ({
      component: html`
        <div
          class="flex items-center justify-between rounded border border-zinc-800 bg-zinc-950 px-3 py-2"
        >
          <span>${label}</span>
          <span class="std-badge">${status}</span>
        </div>
      `,
      key: label,
    })),
  )

  const loadGithub = async () => {
    repo.value = { ...repo.value, loading: true }
    user.value = { ...user.value, loading: true }
    const [repoResult, userResult] = await Promise.all([
      fetchGithubRepo('gardinbe', 'ben-js'),
      fetchGithubUser('gardinbe'),
    ])
    repo.value = applyRequestResult(repoResult, repo.value)
    user.value = applyRequestResult(userResult, user.value)
  }

  const loadWeather = async () => {
    const city = cityCoordinates[selectedCity.value]
    weather.value = { ...weather.value, loading: true }
    weather.value = applyRequestResult(
      await fetchWeather(city.latitude, city.longitude),
      weather.value,
    )
  }

  const loadAdvice = async () => {
    advice.value = { ...advice.value, loading: true }
    advice.value = applyRequestResult(await fetchAdvice(), advice.value)
  }

  void loadGithub()
  void loadWeather()
  void loadAdvice()

  return html`
    <div class="space-y-6">
      <section class="std-panel">
        ${SectionTitle({
          copy: 'Several external APIs with different levels of depth: GitHub profile metadata, Open-Meteo forecasts, and a tiny advice endpoint. Each panel uses the same Result-shaped request path.',
          eyebrow: 'Async workshop',
          title: 'Result-led API surfaces',
        })}
      </section>

      <section class="grid gap-6 lg:grid-cols-[340px_1fr]">
        <aside class="std-panel">
          <h2 class="m-0 mb-4 text-2xl font-black">Request board</h2>
          <div class="grid gap-2">${List(statusRows)}</div>
          <div class="mt-5 grid gap-2">
            ${Button({ onClick: loadGithub }, 'Refresh GitHub')}
            ${Button({ onClick: loadWeather }, 'Refresh weather')}
            ${Button({ onClick: loadAdvice }, 'Refresh advice')}
          </div>
        </aside>

        <div class="grid gap-6">
          <section class="std-panel">
            <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 class="m-0 text-2xl font-black">GitHub package signal</h2>
              <span class="std-badge"
                >${derived(
                  () =>
                    formatDate(repo.value.data?.updated_at ?? '') ??
                    'not loaded',
                )}</span
              >
            </div>
            ${Swap(() =>
              Github(
                repo.value.data,
                user.value.data,
                repo.value.error ?? user.value.error,
                repo.value.loading || user.value.loading,
              ),
            )}
          </section>

          <section class="std-panel">
            <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 class="m-0 text-2xl font-black">Forecast compare</h2>
              <div class="flex flex-wrap gap-2">
                ${Button(
                  {
                    onClick: () => {
                      selectedCity.value = 'london'
                      void loadWeather()
                    },
                  },
                  'London',
                )}
                ${Button(
                  {
                    onClick: () => {
                      selectedCity.value = 'tokyo'
                      void loadWeather()
                    },
                  },
                  'Tokyo',
                )}
                ${Button(
                  {
                    onClick: () => {
                      selectedCity.value = 'new-york'
                      void loadWeather()
                    },
                  },
                  'New York',
                )}
              </div>
            </div>
            ${Swap(() =>
              Weather(
                weather.value.data,
                weather.value.error,
                weather.value.loading,
              ),
            )}
          </section>

          <section class="grid gap-6 md:grid-cols-2">
            <div class="std-panel">
              <h2 class="m-0 mb-4 text-2xl font-black">Small endpoint</h2>
              ${Swap(() =>
                Advice(
                  advice.value.data,
                  advice.value.error,
                  advice.value.loading,
                ),
              )}
            </div>
            ${Suspended(
              UnwrappedExample(),
              LoadingPanel({ label: 'Unwrapping Result' }),
            )}
          </section>
        </div>
      </section>
    </div>
  `
}

export default ApiWorkshopPage

const cityCoordinates = {
  london: { latitude: 51.5072, longitude: -0.1276 },
  'new-york': { latitude: 40.7128, longitude: -74.006 },
  tokyo: { latitude: 35.6762, longitude: 139.6503 },
}

const Github = (
  repo: GithubRepo | null,
  user: GithubUser | null,
  error: string | null,
  loading: boolean,
) => {
  if (loading) {
    return html`<p class="text-cyan-200">Reading GitHub...</p>`
  }

  if (error) {
    return html`<p
      class="rounded border border-red-500/50 bg-red-950/40 p-3 text-red-200"
    >
      ${error}
    </p>`
  }

  if (!repo || !user) {
    return html`<p class="text-zinc-400">GitHub data is waiting.</p>`
  }

  return html`
    <div class="grid gap-4 lg:grid-cols-[1fr_220px]">
      <div>
        <p
          class="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-cyan-300"
        >
          ${repo.full_name}
        </p>
        <p class="text-zinc-300">
          ${repo.description ?? 'No description supplied.'}
        </p>
        <div class="mt-4 grid gap-3 sm:grid-cols-3">
          ${Metric({ label: 'Stars', value: repo.stargazers_count })}
          ${Metric({
            label: 'Forks',
            tone: 'text-emerald-300',
            value: repo.forks_count,
          })}
          ${Metric({
            label: 'Issues',
            tone: 'text-amber-300',
            value: repo.open_issues_count,
          })}
        </div>
      </div>
      <a
        class="unstyled-link rounded border border-zinc-800 bg-zinc-950 p-4 hover:border-cyan-400"
        href="${user.html_url}"
        target="_blank"
      >
        <img
          class="mb-3 size-20 rounded"
          src="${user.avatar_url}"
          alt=""
        />
        <span class="block font-black">${user.name ?? user.login}</span>
        <span class="block text-sm text-zinc-400"
          >${user.followers} followers / ${user.public_repos} repos</span
        >
      </a>
    </div>
  `
}

const Weather = (
  forecast: WeatherForecast | null,
  error: string | null,
  loading: boolean,
) => {
  if (loading) {
    return html`<p class="text-cyan-200">Loading forecast...</p>`
  }

  if (error) {
    return html`<p
      class="rounded border border-red-500/50 bg-red-950/40 p-3 text-red-200"
    >
      ${error}
    </p>`
  }

  if (!forecast) {
    return html`<p class="text-zinc-400">Choose a city to load weather.</p>`
  }

  const days = forecast.daily.time.map((day, index) => ({
    component: html`
      <div class="rounded border border-zinc-800 bg-zinc-950 p-3">
        <p
          class="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-zinc-500"
        >
          ${formatDate(day)}
        </p>
        <p class="text-xl font-black">
          ${forecast.daily.temperature_2m_max[index]} /
          ${forecast.daily.temperature_2m_min[index]}°C
        </p>
      </div>
    `,
    key: day,
  }))

  return html`
    <div class="space-y-4">
      <div class="grid gap-3 sm:grid-cols-3">
        ${Metric({
          label: 'Now',
          tone: 'text-emerald-300',
          value: `${forecast.current.temperature_2m}${forecast.current_units.temperature_2m}`,
        })}
        ${Metric({
          label: 'Wind',
          value: `${forecast.current.wind_speed_10m}${forecast.current_units.wind_speed_10m}`,
        })}
        ${Metric({
          label: 'Timezone',
          tone: 'text-amber-300',
          value: forecast.timezone,
        })}
      </div>
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        ${List(() => days)}
      </div>
    </div>
  `
}

const Advice = (
  advice: AdviceSlip | null,
  error: string | null,
  loading: boolean,
) => {
  if (loading) {
    return html`<p class="text-cyan-200">Fetching a small response...</p>`
  }

  if (error) {
    return html`<p
      class="rounded border border-red-500/50 bg-red-950/40 p-3 text-red-200"
    >
      ${error}
    </p>`
  }

  return html`
    <blockquote
      class="m-0 rounded border border-zinc-800 bg-zinc-950 p-4 text-lg font-semibold leading-8 text-zinc-200"
    >
      ${advice?.slip.advice ?? 'No advice loaded.'}
    </blockquote>
  `
}

const UnwrappedExample = async () => {
  const data = await unwrap(fetchGithubRepo('gardinbe', 'ben-js'))

  return html`
    <div class="std-panel">
      <h2 class="m-0 mb-4 text-2xl font-black">unwrap demo</h2>
      <p class="text-zinc-300">
        Suspended content can also unwrap a successful Result directly. This
        loaded
        <strong>${data.full_name}</strong>
        with ${data.stargazers_count} stars.
      </p>
    </div>
  `
}
