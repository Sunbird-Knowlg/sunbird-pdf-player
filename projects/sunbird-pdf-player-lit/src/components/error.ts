import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
@customElement('sb-player-error')
export class ErrorComponent extends LitElement {
  @property({ type: String }) message = 'Something went wrong';
  createRenderRoot() { return this; }
  render() { return html`<div class=\"flex flex-col items-center justify-center h-full bg-red-50 p-8 text-center\"><div class=\"w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4\"><svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke-width=\"2\" stroke=\"currentColor\" class=\"w-10 h-10\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z\" /></svg></div><h2 class=\"text-2xl font-bold text-red-800 mb-2\">Error</h2><p class=\"text-red-600 max-w-md mx-auto\">${this.message}</p><button @click=\${() => window.location.reload()} class=\"mt-6 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition-colors\">Try Again</button></div>`; }
}
