// Use namespace import so Rollup can resolve the module even when named
// exports aren't statically recognized from the CJS/ESM dual-format package.
import * as TelemetrySdk from '@project-sunbird/telemetry-sdk';
import type { PlayerConfig } from '../interfaces';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const $t: any = (TelemetrySdk as any).$t ?? TelemetrySdk;

export class TelemetryService {
  private contentSessionId: string;
  private playSessionId!: string;
  private telemetryObject: any;
  private context: any;
  private onTelemetryEvent?: (event: any) => void;

  constructor() {
    this.contentSessionId = this._uniqueId();
  }

  private _uniqueId(length = 32): string {
    let result = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  public initialize(
    { context, metadata }: PlayerConfig,
    onTelemetryEvent?: (event: any) => void
  ) {
    this.context = context;
    this.onTelemetryEvent = onTelemetryEvent;
    this.playSessionId = this._uniqueId();

    if (!context) return;

    if (!$t.isInitialized) {
      const telemetryConfig: any = {
        pdata: context.pdata || { id: 'in.sunbird', ver: '1.0' },
        env: 'contentplayer',
        channel: context.channel || 'in.sunbird',
        did: context.did,
        authtoken: context.authToken || '',
        uid: context.uid || '',
        sid: context.sid,
        batchsize: 20,
        mode: context.mode,
        host: context.host || '',
        endpoint: context.endpoint || '/data/v3/telemetry',
        tags: context.tags,
        cdata: [
          ...(context.cdata || []),
          { id: this.contentSessionId, type: 'ContentSession' },
          { id: this.playSessionId, type: 'PlaySession' },
          { id: '2.0', type: 'PlayerVersion' },
        ],
        dispatcher: {
          dispatch: (event: any) => {
            if (context.dispatcher) (context.dispatcher as any).dispatch(event);
            if (this.onTelemetryEvent) this.onTelemetryEvent(event);
          },
        },
      };
      $t.initialize(telemetryConfig);
    }

    this.telemetryObject = {
      id: metadata.identifier,
      type: 'Content',
      ver: metadata.pkgVersion != null ? String(metadata.pkgVersion) : '1.0',
      rollup: context.objectRollup || {},
    };
  }

  public async start(duration: number) {
    if (!$t.isInitialized) return;
    await $t.start(
      {},
      this.telemetryObject.id,
      this.telemetryObject.ver,
      { type: 'content', mode: 'play', pageid: '', duration: +(duration / 1e3).toFixed(2) },
      { context: this._getEventContext(), object: this.telemetryObject }
    );
  }

  public end(
    duration: number,
    currentPage: number,
    totalpages: number,
    visitedlength: number,
    endpageseen: boolean
  ) {
    if (!$t.isInitialized) return;
    $t.end(
      {
        type: 'content',
        mode: 'play',
        pageid: 'sunbird-player-Endpage',
        summary: [
          { progress: +((currentPage / totalpages) * 100).toFixed(0) },
          { totallength: totalpages },
          { visitedlength },
          { visitedcontentend: currentPage === totalpages },
          { totalseekedlength: totalpages - visitedlength },
          { endpageseen },
        ],
        duration: +(duration / 1e3).toFixed(2),
      },
      { context: this._getEventContext(), object: this.telemetryObject }
    );
  }

  public interact(id: string, currentPage: number) {
    if (!$t.isInitialized) return;
    $t.interact(
      { type: 'TOUCH', subtype: '', id, pageid: String(currentPage) },
      { context: this._getEventContext(), object: this.telemetryObject }
    );
  }

  public heartbeat(data: any) {
    if (!$t.isInitialized) return;
    $t.heartbeat(data, { context: this._getEventContext(), object: this.telemetryObject });
  }

  public impression(currentPage: number) {
    if (!$t.isInitialized) return;
    $t.impression(
      { type: 'workflow', subtype: '', pageid: String(currentPage), uri: '' },
      { context: this._getEventContext(), object: this.telemetryObject }
    );
  }

  public error(error: any, data: { err: string; errtype: string }) {
    if (!$t.isInitialized) return;
    $t.error(
      { err: data.err, errtype: data.errtype, stacktrace: error?.toString() || '' },
      { context: this._getEventContext(), object: this.telemetryObject }
    );
  }

  private _getEventContext() {
    return {
      channel: this.context?.channel || 'in.sunbird',
      pdata: this.context?.pdata || { id: 'in.sunbird', ver: '1.0' },
      env: 'contentplayer',
      sid: this.context?.sid,
      uid: this.context?.uid,
      cdata: [
        ...(this.context?.cdata || []),
        { id: this.contentSessionId, type: 'ContentSession' },
        { id: this.playSessionId, type: 'PlaySession' },
        { id: '2.0', type: 'PlayerVersion' },
      ],
      rollup: this.context?.contextRollup || {},
    };
  }
}

export const telemetryService = new TelemetryService();
