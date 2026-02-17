
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('sb-player-header')
export class Header extends LitElement {
  @property({ type: Number }) pageNumber = 1;
  @property({ type: Number }) totalPages = 0;

  createRenderRoot() {
    return this;
  }

  private _handleAction(type: string, data?: any) {
    this.dispatchEvent(new CustomEvent('actions', {
        detail: { type, data },
        bubbles: true,
        composed: true
    }));
  }

  render() {
    return html`
      <div class="flex items-center justify-between bg-white border-b border-gray-200 px-4 py-2 shadow-sm">
        <div class="flex items-center space-x-2">
            <button @click=${() => this._handleAction('ZOOM_OUT')} class="p-2 hover:bg-gray-100 rounded" title="Zoom Out">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607M13.5 10.5h-6" />
                </svg>
            </button>
            <button @click=${() => this._handleAction('ZOOM_IN')} class="p-2 hover:bg-gray-100 rounded" title="Zoom In">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607M10.5 7.5v6m3-3h-6" />
                </svg>
            </button>
            <button @click=${() => this._handleAction('ROTATE_CW')} class="p-2 hover:bg-gray-100 rounded" title="Rotate">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
            </button>
        </div>

        <div class="flex items-center space-x-2">
            <input type="number" .value=${String(this.pageNumber)}
                @change=${(e: any) => this._handleAction('NAVIGATE_TO_PAGE', Number(e.target.value))}
                class="w-12 border border-gray-300 rounded px-1 text-center" min="1" max=${this.totalPages} />
            <span class="text-gray-600">of ${this.totalPages}</span>
        </div>

        <div class="flex items-center space-x-2">
            <button @click=${() => this._handleAction('PREVIOUS')} class="p-2 hover:bg-gray-100 rounded" ?disabled=${this.pageNumber <= 1}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
            </button>
            <button @click=${() => this._handleAction('NEXT')} class="p-2 hover:bg-gray-100 rounded" ?disabled=${this.pageNumber >= this.totalPages}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
            </button>
            <button @click=${() => this._handleAction('DOWNLOAD')} class="p-2 hover:bg-gray-100 rounded" title="Download">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M7.5 12 12 16.5m0 0L16.5 12M12 16.5V3" />
                </svg>
            </button>
        </div>
      </div>
    `;
  }
}
