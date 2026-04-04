import { LitElement, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * Completion screen shown after the user reaches the last page.
 */
@customElement('sb-player-end-page')
export class EndPage extends LitElement {
  @property({ type: String }) contentName = '';
  @property({ type: String }) userName = '';
  @property({ type: Number }) pagesRead = 0;
  @property({ type: Number }) totalPages = 0;
  @property({ type: String }) timeSpentLabel = '';
  /** Whether to show the exit button (config.sideMenu.showExit) */
  @property({ type: Boolean }) showExit = false;

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

  private get _progress(): number {
    if (!this.totalPages) return 100;
    return Math.round((this.pagesRead / this.totalPages) * 100);
  }

  render() {
    return html`
      <div
        class="flex flex-col items-center justify-center h-full p-6"
        style="background:var(--pdf-page-bg);"
        role="main"
        aria-label="PDF completed"
      >
        <div
          class="rounded-2xl shadow-xl p-8 w-full max-w-sm text-center"
          style="background:var(--pdf-card-bg);color:var(--pdf-header-text);"
        >
          <!-- Success icon -->
          <div
            class="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style="background:#dcfce7;"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
              stroke="#16a34a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
              width="32" height="32" aria-hidden="true">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
          </div>

          <h2 class="text-xl font-bold mb-1">
            ${this._progress >= 100 ? 'Completed!' : 'Good progress!'}
          </h2>

          ${this.contentName ? html`
            <p class="text-sm mb-5 truncate max-w-xs mx-auto" style="color:var(--pdf-header-icon);"
              title=${this.contentName}>
              ${this.contentName}
            </p>
          ` : nothing}

          <!-- Stats grid -->
          <div class="grid grid-cols-3 gap-3 mb-6">
            ${this._stat('Pages', `${this.pagesRead}${this.totalPages ? '/' + this.totalPages : ''}`)}
            ${this._stat('Progress', `${this._progress}%`)}
            ${this._stat('Time', this.timeSpentLabel || '—')}
          </div>

          <!-- Actions -->
          <div class="flex flex-col gap-2">
            <button
              @click=${() => this._emit('REPLAY')}
              aria-label="Replay from beginning"
              style="background:var(--pdf-primary);color:var(--pdf-primary-text);border-radius:var(--pdf-button-radius);"
              class="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" width="16" height="16" aria-hidden="true">
                <path d="M1 4v6h6"/>
                <path d="M3.51 15a9 9 0 1 0 .49-5"/>
              </svg>
              Replay
            </button>

            ${this.showExit ? html`
              <button
                @click=${() => this._emit('EXIT')}
                aria-label="Exit player"
                style="border-radius:var(--pdf-button-radius);border:1px solid var(--pdf-header-border);"
                class="w-full py-2.5 text-sm font-semibold hover:bg-[var(--pdf-sidebar-item-hover)] transition-colors"
              >
                Exit
              </button>
            ` : nothing}
          </div>

          ${this.userName ? html`
            <p class="mt-5 text-xs" style="color:var(--pdf-header-icon);">
              — ${this.userName}
            </p>
          ` : nothing}
        </div>
      </div>
    `;
  }

  private _stat(label: string, value: string) {
    return html`
      <div
        class="rounded-lg py-3 px-2"
        style="background:var(--pdf-page-bg);"
      >
        <p class="text-xs font-semibold uppercase tracking-wide mb-1"
          style="color:var(--pdf-header-icon);">${label}</p>
        <p class="text-base font-bold">${value}</p>
      </div>
    `;
  }
}
