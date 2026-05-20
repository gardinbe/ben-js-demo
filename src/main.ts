import '~/lib/styles/main.css'
import { enableDevMode, printTree } from 'ben-js'

import { App } from '~/App'

enableDevMode()

const app = App()
app.mount('#app')

// @ts-expect-error this is for development
window.printTree = () => {
  printTree(app)
}

// @ts-expect-error this is for development
window.app = app
