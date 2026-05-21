import { type Config } from 'stylelint'

const config: Config = {
  extends: '@gardinbe/config/stylelint',
  rules: {
    'import-notation': null,
  },
}

export default config
