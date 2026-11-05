import { printTree } from '@ben-js/core/dev'

import { App } from '~/App'

const app = App()
app.mount('#app')

// @ts-expect-error development console helper
window.printTree = () => {
  printTree(app)
}

// @ts-expect-error development console helper
window.app = app
