import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * Loading / splash screen displayed while the PDF is being fetched.
 */
@customElement('sb-player-start-page')
export class StartPage extends LitElement {
  @property({ type: String }) title = '';
  @property({ type: Number }) progress = 0;

  createRenderRoot() { return this; }

  render() {
    return html`
      <div
        class="flex flex-col items-center justify-center h-full p-8 text-center"
        style="background:var(--pdf-page-bg);"
        role="status"
        aria-label="Loading PDF: ${this.progress}%"
        aria-live="polite"
      >
        <!-- Document icon with spinner ring -->
        <div class="relative mb-6">
          <div
            class="w-20 h-20 rounded-full flex items-center justify-center"
            style="background:var(--pdf-primary);"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
              stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
              width="36" height="36" aria-hidden="true">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
          </div>
          <!-- Spinner ring -->
          <svg
            class="pdf-spinner absolute -inset-1 w-[88px] h-[88px]"
            viewBox="0 0 88 88"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="44" cy="44" r="40" stroke="var(--pdf-primary)" stroke-width="3"
              stroke-dasharray="251" stroke-dashoffset="${251 - (251 * this.progress) / 100}"
              stroke-linecap="round"
              style="transition:stroke-dashoffset 0.3s ease;"
            />
          </svg>
        </div>

        <h1
          class="text-lg font-semibold mb-1 max-w-xs truncate"
          style="color:var(--pdf-header-text);"
          title=${this.title}
        >
          ${this.title || 'Loading PDF…'}
        </h1>

        <!-- Progress bar -->
        <div
          class="mt-4 w-56 rounded-full overflow-hidden"
          style="height:6px;background:var(--pdf-header-border);"
          role="progressbar"
          aria-valuenow=${this.progress}
          aria-valuemin="0"
          aria-valuemax="100"
        >
          <div
            class="h-full rounded-full transition-all duration-300"
            style="width:${this.progress}%;background:var(--pdf-primary);"
          ></div>
        </div>

        <p class="mt-2 text-xs" style="color:var(--pdf-header-icon);">
          ${this.progress > 0 ? `${this.progress}%` : 'Please wait…'}
        </p>
      </div>
    `;
  }
}
