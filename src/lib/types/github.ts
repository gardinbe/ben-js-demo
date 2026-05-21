export type GithubRepo = {
  description: string | null
  forks_count: number
  full_name: string
  html_url: string
  language: string | null
  open_issues_count: number
  stargazers_count: number
  updated_at: string
}

export type GithubUser = {
  avatar_url: string
  bio: string | null
  blog: string
  followers: number
  following: number
  html_url: string
  location: string | null
  login: string
  name: string | null
  public_repos: number
}
