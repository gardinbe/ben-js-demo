import { createUrl, requestJson } from '~/lib/services/json-client'
import { type GithubRepo, type GithubUser } from '~/lib/types/github'
import {
  isNullableString,
  isNumber,
  isRecord,
  isString,
} from '~/lib/utils/predicates'
import { type Result } from '~/lib/utils/result'

export const fetchGithubRepo = (
  owner: string,
  repo: string,
): Promise<Result<GithubRepo>> =>
  requestJson(
    {
      decoderError: 'GitHub returned an unexpected repository payload',
      url: createUrl('https://api.github.com/', ['repos', owner, repo]),
    },
    isGithubRepo,
  )

export const fetchGithubUser = (user: string): Promise<Result<GithubUser>> =>
  requestJson(
    {
      decoderError: 'GitHub returned an unexpected user payload',
      url: createUrl('https://api.github.com/', ['users', user]),
    },
    isGithubUser,
  )

const isGithubRepo = (value: unknown): value is GithubRepo =>
  isRecord(value) &&
  isNullableString(value.description) &&
  isNumber(value.forks_count) &&
  isString(value.full_name) &&
  isString(value.html_url) &&
  isNullableString(value.language) &&
  isNumber(value.open_issues_count) &&
  isNumber(value.stargazers_count) &&
  isString(value.updated_at)

const isGithubUser = (value: unknown): value is GithubUser =>
  isRecord(value) &&
  isString(value.avatar_url) &&
  isNullableString(value.bio) &&
  isString(value.blog) &&
  isNumber(value.followers) &&
  isNumber(value.following) &&
  isString(value.html_url) &&
  isNullableString(value.location) &&
  isString(value.login) &&
  isNullableString(value.name) &&
  isNumber(value.public_repos)
