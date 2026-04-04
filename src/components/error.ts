import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * Error screen shown when the PDF fails to load.
 * Provides a retry button that emits REPLAY.
 */
@customElement('sb-player-error')
export class ErrorPage extends LitElement {
  @property({ type: String }) message = 'Failed to load PDF document.';

  createRenderRoot() { return this; }

  private _emit(type: string) {
    this.dispatchEvent(
      new CustomEvent('actions', {
        detail: { type },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    return html`
      <div
        class="flex flex-col items-center justify-center h-full p-8 text-center"
        style="background:var(--pdf-page-bg);"
        role="alert"
        aria-live="assertive"
      >
        <div
          class="rounded-2xl shadow-xl p-8 w-full max-w-sm"
          style="background:var(--pdf-card-bg);"
        >
          <!-- Error icon -->
          <div
            class="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style="background:#fee2e2;"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
              stroke="#dc2626" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
              width="32" height="32" aria-hidden="true">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
          </div>

          <h2
            class="text-lg font-bold mb-2"
            style="color:var(--pdf-header-text);"
          >
            Could not load PDF
          </h2>

          <p
            class="text-sm mb-6 leading-relaxed"
            style="color:var(--pdf-header-icon);"
          >
            ${this.message || 'An unexpected error occurred. Please check your internet connection and try again.'}
          </p>

          <button
            @click=${() => this._emit('REPLAY')}
            aria-label="Retry loading"
            style="background:var(--pdf-primary);color:var(--pdf-primary-text);border-radius:var(--pdf-button-radius);"
            class="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" width="16" height="16" aria-hidden="true">
              <path d="M1 4v6h6"/>
              <path d="M3.51 15a9 9 0 1 0 .49-5"/>
            </svg>
            Try Again
          </button>
        </div>
      </div>
    `;
  }
}
