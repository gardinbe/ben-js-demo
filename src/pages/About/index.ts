import { type RouteComponent } from '@ben-js/router'
import { html } from 'ben-js'

const AboutPage: RouteComponent = () => html`
  <div class="std-container">
    <h1>About</h1>
    <p>This is the about page!</p>
  </div>
`

export default AboutPage
