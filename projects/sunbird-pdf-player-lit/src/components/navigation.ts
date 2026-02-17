
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('sb-player-navigation')
export class Navigation extends LitElement {
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
      <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
        <button @click=${() => this._handleAction('PREVIOUS')}
            class="pointer-events-auto bg-black bg-opacity-20 hover:bg-opacity-40 text-white rounded-full p-3 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-8 h-8">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
        </button>
      </div>
      <div class="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
        <button @click=${() => this._handleAction('NEXT')}
            class="pointer-events-auto bg-black bg-opacity-20 hover:bg-opacity-40 text-white rounded-full p-3 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-8 h-8">
              <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
        </button>
      </div>
    `;
  }
}
