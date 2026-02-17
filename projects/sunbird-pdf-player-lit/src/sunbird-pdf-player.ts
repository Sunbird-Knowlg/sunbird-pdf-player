
import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { PlayerConfig } from './interfaces';
import { telemetryService } from './services/telemetry-service';
import './components/pdf-viewer';
import './components/start-page';
import './components/header';
import './components/navigation';
import './components/end-page';
import './components/error';
import { PdfViewer } from './components/pdf-viewer';

@customElement('sunbird-pdf-player')
export class SunbirdPdfPlayer extends LitElement {
  @property({ type: String, attribute: 'player-config' }) playerConfigAttr = '';
  @state() playerConfig?: PlayerConfig;

  @state() viewState: 'start' | 'player' | 'end' | 'error' = 'start';
  @state() loadingProgress = 0;
  @state() currentPagePointer = 1;
  @state() totalNumberOfPages = 0;
  @state() zoom = 100;
  @state() rotation = 0;
  @state() errorMessage = '';
  @state() showControls = true;

  private startTime = 0;
  private pagesVisited: Set<number> = new Set();
  private isEndEventRaised = false;

  @query('pdf-viewer') pdfViewer!: PdfViewer;

  createRenderRoot() {
    return this;
  }

  protected updated(changedProperties: PropertyValues) {
    if (changedProperties.has('playerConfigAttr') && this.playerConfigAttr) {
      try {
        this.playerConfig = JSON.parse(this.playerConfigAttr);
        this._initialize();
      } catch (e) {
        console.error('Invalid player-config', e);
        this.viewState = 'error';
        this.errorMessage = 'Invalid player-config';
      }
    }
  }

  private _initialize() {
    if (!this.playerConfig) return;

    this.startTime = Date.now();
    this.pagesVisited = new Set();
    this.isEndEventRaised = false;
    this.currentPagePointer = this.playerConfig.config?.startFromPage || 1;
    this.zoom = this.playerConfig.config?.zoom || 100;
    this.rotation = this.playerConfig.config?.rotation || 0;

    telemetryService.initialize(this.playerConfig, (event) => {
      this.dispatchEvent(new CustomEvent('telemetryEvent', { detail: event }));
    });
    this.viewState = 'start';
    this.loadingProgress = 0;
  }

  private _handleViewerEvent(e: CustomEvent) {
    const { type, data } = e.detail;

    switch (type) {
      case 'progress':
        this.loadingProgress = data;
        break;
      case 'pagesloaded':
        this.totalNumberOfPages = data.pagesCount;
        this.viewState = 'player';
        this._raiseStartEvent();
        break;
      case 'pagechanging':
        this.currentPagePointer = data.pageNumber;
        this.pagesVisited.add(data.pageNumber);
        telemetryService.impression(this.currentPagePointer);
        telemetryService.heartbeat({ type: 'PAGE_CHANGE', currentPage: this.currentPagePointer });
        this._emitPlayerEvent({ type: 'PAGE_CHANGE', data });
        break;
      case 'pageend':
        this._showEndPage();
        break;
      case 'error':
        this.viewState = 'error';
        this.errorMessage = data.toString();
        telemetryService.error(data, { err: 'CONTENT_LOAD_FAILED', errtype: 'CONTENT' });
        break;
    }
  }

  private _handleHeaderActions(e: CustomEvent) {
    const { type, data } = e.detail;
    telemetryService.interact(type, this.currentPagePointer);

    switch (type) {
      case 'NEXT':
        if (this.currentPagePointer < this.totalNumberOfPages) {
          this.pdfViewer.navigateToPage(this.currentPagePointer + 1);
        } else {
          this._showEndPage();
        }
        break;
      case 'PREVIOUS':
        if (this.currentPagePointer > 1) {
          this.pdfViewer.navigateToPage(this.currentPagePointer - 1);
        }
        break;
      case 'ZOOM_IN':
        this.zoom = Math.min(this.zoom + 20, 300);
        break;
      case 'ZOOM_OUT':
        this.zoom = Math.max(this.zoom - 20, 50);
        break;
      case 'ROTATE_CW':
        this.rotation = (this.rotation + 90) % 360;
        break;
      case 'NAVIGATE_TO_PAGE':
        this.pdfViewer.navigateToPage(data);
        break;
      case 'DOWNLOAD':
        this._downloadPdf();
        break;
      case 'REPLAY':
        this._initialize();
        break;
      case 'EXIT':
        this._emitPlayerEvent({ type: 'EXIT' });
        break;
    }
  }

  private _raiseStartEvent() {
    const duration = Date.now() - this.startTime;
    telemetryService.start(duration);
    this._emitPlayerEvent({ type: 'START', data: { duration } });
  }

  private _showEndPage() {
    if (this.isEndEventRaised) return;

    this.viewState = 'end';
    const duration = Date.now() - this.startTime;
    telemetryService.end(
      duration,
      this.currentPagePointer,
      this.totalNumberOfPages,
      this.pagesVisited.size,
      true
    );
    this.isEndEventRaised = true;
    this._emitPlayerEvent({ type: 'END', data: { duration } });
  }

  private _emitPlayerEvent(event: any) {
    this.dispatchEvent(new CustomEvent('playerEvent', { detail: event }));
  }

  private _downloadPdf() {
    if (this.playerConfig?.metadata.artifactUrl) {
      window.open(this.playerConfig.metadata.artifactUrl, '_blank');
      this._emitPlayerEvent({ type: 'DOWNLOAD' });
    }
  }

  private _getTimeSpent() {
    const duration = Date.now() - this.startTime;
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  render() {
    if (!this.playerConfig && this.viewState !== 'error') {
      return html`<div class="flex items-center justify-center h-full">Waiting for configuration...</div>`;
    }

    return html`
      <div class="relative w-full h-full flex flex-col overflow-hidden bg-gray-100 font-sans"
           @mouseenter=${() => this.showControls = true}
           @mouseleave=${() => this.showControls = false}>

        ${this.viewState === 'start' ? html`
          <sb-player-start-page
            .title=${this.playerConfig?.metadata.name || ''}
            .progress=${this.loadingProgress}>
          </sb-player-start-page>
        ` : ''}

        ${this.viewState === 'player' ? html`
          <sb-player-header
            class="transition-opacity duration-300 ${this.showControls ? 'opacity-100' : 'opacity-0'}"
            .pageNumber=${this.currentPagePointer}
            .totalPages=${this.totalNumberOfPages}
            @actions=${this._handleHeaderActions}>
          </sb-player-header>

          <div class="flex-grow relative overflow-hidden">
            <pdf-viewer
              .src=${this.playerConfig?.metadata.artifactUrl || ''}
              .zoom=${this.zoom}
              .rotation=${this.rotation}
              .initialPage=${this.currentPagePointer}
              @viewerEvent=${this._handleViewerEvent}>
            </pdf-viewer>

            <sb-player-navigation
                class="transition-opacity duration-300 ${this.showControls ? 'opacity-100' : 'opacity-0'}"
                @actions=${this._handleHeaderActions}>
            </sb-player-navigation>
          </div>

          <div class="bg-gray-800 text-white text-xs py-1 px-4 flex justify-between">
            <span>${this.playerConfig?.metadata.name}</span>
            <span>Page ${this.currentPagePointer} of ${this.totalNumberOfPages}</span>
          </div>
        ` : ''}

        ${this.viewState === 'end' ? html`
          <sb-player-end-page
            .contentName=${this.playerConfig?.metadata.name || ''}
            .userName=${this.playerConfig?.context?.userData?.firstName || 'Anonymous'}
            .outcome=${this.pagesVisited.size}
            .timeSpentLabel=${this._getTimeSpent()}
            @actions=${this._handleHeaderActions}>
          </sb-player-end-page>
        ` : ''}

        ${this.viewState === 'error' ? html`
          <sb-player-error .message=${this.errorMessage}></sb-player-error>
        ` : ''}
      </div>
    `;
  }
}
