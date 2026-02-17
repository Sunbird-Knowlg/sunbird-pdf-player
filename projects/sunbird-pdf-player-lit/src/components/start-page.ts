import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('sb-player-start-page')
export class StartPage extends LitElement {
  @property({ type: String }) title = '';
  @property({ type: Number }) progress = 0;

  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <div class="flex flex-col items-center justify-center h-full bg-gray-100 p-8 text-center">
        <div class="mb-8">
            <div class="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center text-white mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
            </div>
            <h1 class="text-2xl font-bold text-gray-800">${this.title}</h1>
        </div>

        <div class="w-64 bg-gray-300 rounded-full h-2.5 mb-4">
          <div class="bg-blue-600 h-2.5 rounded-full" style="width: ${this.progress}%"></div>
        </div>
        <p class="text-gray-600">Loading ${this.progress}%</p>
      </div>
    `;
  }
}
