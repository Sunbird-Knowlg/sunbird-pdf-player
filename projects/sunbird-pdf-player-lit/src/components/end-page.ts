
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('sb-player-end-page')
export class EndPage extends LitElement {
  @property({ type: String }) contentName = '';
  @property({ type: String }) userName = '';
  @property({ type: Number }) outcome = 0;
  @property({ type: String }) timeSpentLabel = '';

  createRenderRoot() {
    return this;
  }

  private _handleAction(type: string) {
    this.dispatchEvent(new CustomEvent('actions', {
        detail: { type },
        bubbles: true,
        composed: true
    }));
  }

  render() {
    return html`
      <div class="flex flex-col items-center justify-center h-full bg-gray-100 p-8">
        <div class="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
            <div class="mb-6">
                <div class="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-10 h-10">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                </div>
                <h2 class="text-2xl font-bold text-gray-800">Completed!</h2>
                <p class="text-gray-600">${this.contentName}</p>
            </div>

            <div class="grid grid-cols-2 gap-4 mb-8">
                <div class="bg-gray-50 p-4 rounded-lg">
                    <p class="text-sm text-gray-500 uppercase tracking-wide font-semibold">Pages Read</p>
                    <p class="text-2xl font-bold text-gray-800">${this.outcome}</p>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg">
                    <p class="text-sm text-gray-500 uppercase tracking-wide font-semibold">Time Spent</p>
                    <p class="text-2xl font-bold text-gray-800">${this.timeSpentLabel}</p>
                </div>
            </div>

            <div class="flex flex-col space-y-3">
                <button @click=${() => this._handleAction('REPLAY')}
                    class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 mr-2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                    Replay
                </button>
                <button @click=${() => this._handleAction('EXIT')}
                    class="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 rounded-lg transition-colors">
                    Exit
                </button>
            </div>

            <p class="mt-6 text-sm text-gray-500">User: ${this.userName}</p>
        </div>
      </div>
    `;
  }
}
