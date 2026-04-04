import { LitElement, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * Left/right floating navigation arrows overlaid on the PDF viewer.
 * Hides itself when there is only one page.
 */
@customElement('sb-player-navigation')
export class Navigation extends LitElement {
  @property({ type: Number }) pageNumber = 1;
  @property({ type: Number }) totalPages = 0;

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
    if (this.totalPages <= 1) return nothing;

    const atFirst = this.pageNumber <= 1;
    const atLast = this.pageNumber >= this.totalPages;

    return html`
      <!-- Previous arrow -->
      <div class="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none z-10">
        <button
          @click=${() => this._emit('PREVIOUS')}
          ?disabled=${atFirst}
          aria-label="Previous page"
          aria-disabled=${atFirst}
          title="Previous page"
          style="background:var(--pdf-nav-bg);border-radius:50%;color:var(--pdf-nav-text);"
          class="pointer-events-auto p-2.5 transition-all hover:scale-105 disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-white"
          @mouseenter=${(e: MouseEvent) => {
            if (!atFirst) (e.currentTarget as HTMLElement).style.background = 'var(--pdf-nav-bg-hover)';
          }}
          @mouseleave=${(e: MouseEvent) => {
            (e.currentTarget as HTMLElement).style.background = 'var(--pdf-nav-bg)';
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
            width="24" height="24" aria-hidden="true">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
      </div>

      <!-- Next arrow -->
      <div class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none z-10">
        <button
          @click=${() => this._emit('NEXT')}
          ?disabled=${atLast}
          aria-label="Next page"
          aria-disabled=${atLast}
          title="Next page"
          style="background:var(--pdf-nav-bg);border-radius:50%;color:var(--pdf-nav-text);"
          class="pointer-events-auto p-2.5 transition-all hover:scale-105 disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-white"
          @mouseenter=${(e: MouseEvent) => {
            if (!atLast) (e.currentTarget as HTMLElement).style.background = 'var(--pdf-nav-bg-hover)';
          }}
          @mouseleave=${(e: MouseEvent) => {
            (e.currentTarget as HTMLElement).style.background = 'var(--pdf-nav-bg)';
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
            width="24" height="24" aria-hidden="true">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>
      </div>
    `;
  }
}
