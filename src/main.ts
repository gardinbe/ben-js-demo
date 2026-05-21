import { enableDevMode, printTree } from 'ben-js'

import { App } from '~/App'

enableDevMode()

const app = App()
app.mount('#app')

// @ts-expect-error development console helper
window.printTree = () => {
  printTree(app)
}

// @ts-expect-error development console helper
window.app = app
