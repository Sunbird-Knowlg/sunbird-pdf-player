
import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import * as pdfjsLib from 'pdfjs-dist';

// In a real environment, you might want to bundle the worker or use a local path
// For now, we use a CDN compatible with the version installed
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.mjs`;

@customElement('pdf-viewer')
export class PdfViewer extends LitElement {
  @property({ type: String }) src = '';
  @property({ type: Number }) zoom = 100;
  @property({ type: Number }) rotation = 0;
  @property({ type: Number }) initialPage = 1;

  @state() private _pdf: any = null;
  @state() private _pagesCount = 0;
  @state() private _loading = false;

  @query('#viewer-container') viewerContainer!: HTMLDivElement;

  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
    #viewer-container {
      width: 100%;
      height: 100%;
      overflow: auto;
      background-color: #525659;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px 0;
    }
    .page-container {
      margin-bottom: 20px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.3);
      background-color: white;
    }
    canvas {
      display: block;
    }
  `;

  protected updated(changedProperties: PropertyValues) {
    if (changedProperties.has('src') && this.src) {
      this._loadDocument();
    }
    if ((changedProperties.has('zoom') || changedProperties.has('rotation')) && this._pdf) {
      this._renderAllPages();
    }
  }

  private async _loadDocument() {
    this._loading = true;
    this.dispatchEvent(new CustomEvent('viewerEvent', { detail: { type: 'progress', data: 10 } }));
    try {
      const loadingTask = pdfjsLib.getDocument(this.src);
      loadingTask.onProgress = (progress) => {
        const percent = (progress.loaded / progress.total) * 100;
        this.dispatchEvent(new CustomEvent('viewerEvent', { detail: { type: 'progress', data: Math.round(percent) } }));
      };
      this._pdf = await loadingTask.promise;
      this._pagesCount = this._pdf.numPages;
      this.dispatchEvent(new CustomEvent('viewerEvent', {
        detail: { type: 'pagesloaded', data: { pagesCount: this._pagesCount } }
      }));
      await this._renderAllPages();

      if (this.initialPage > 1) {
          this.navigateToPage(this.initialPage);
      }
    } catch (error) {
      this.dispatchEvent(new CustomEvent('viewerEvent', {
        detail: { type: 'error', data: error }
      }));
    } finally {
      this._loading = false;
    }
  }

  private async _renderAllPages() {
    if (!this._pdf) return;
    this.viewerContainer.innerHTML = '';
    for (let i = 1; i <= this._pagesCount; i++) {
      const pageContainer = document.createElement('div');
      pageContainer.className = 'page-container';
      pageContainer.id = `page-${i}`;
      this.viewerContainer.appendChild(pageContainer);
      await this._renderPage(i, pageContainer);
    }
  }

  private async _renderPage(pageNo: number, container: HTMLElement) {
    const page = await this._pdf.getPage(pageNo);
    const viewport = page.getViewport({ scale: this.zoom / 100, rotation: this.rotation });

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    container.style.width = `${viewport.width}px`;
    container.style.height = `${viewport.height}px`;
    container.appendChild(canvas);

    const renderContext = {
      canvasContext: context!,
      viewport: viewport
    };
    await page.render(renderContext).promise;
  }

  public navigateToPage(pageNo: number) {
    const pageElement = this.viewerContainer.querySelector(`#page-${pageNo}`);
    if (pageElement) {
      pageElement.scrollIntoView();
    }
  }

  private _handleScroll() {
    const container = this.viewerContainer;
    const scrollPos = container.scrollTop + container.offsetHeight / 2;
    let currentPage = 1;

    const pages = container.querySelectorAll('.page-container');
    pages.forEach((page: any, index) => {
      if (page.offsetTop <= scrollPos) {
        currentPage = index + 1;
      }
    });

    this.dispatchEvent(new CustomEvent('viewerEvent', {
      detail: { type: 'pagechanging', data: { pageNumber: currentPage } }
    }));

    if (container.scrollTop + container.offsetHeight >= container.scrollHeight - 10) {
      this.dispatchEvent(new CustomEvent('viewerEvent', { detail: { type: 'pageend' } }));
    }
  }

  render() {
    return html`
      <div id="viewer-container" @scroll=${this._handleScroll}>
        ${this._loading ? html`<div>Loading PDF...</div>` : ''}
      </div>
    `;
  }
}
