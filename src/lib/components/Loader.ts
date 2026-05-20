import { html } from 'ben-js'

export const Loader = () => {
  return html`
    <div
      class="loader"
      aria-label="Loading"
    ></div>

    <style>
      .loader {
        width: 48px;
        height: 48px;
        border: 5px solid #ddd;
        border-top-color: #111;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
    </style>
  `
}
