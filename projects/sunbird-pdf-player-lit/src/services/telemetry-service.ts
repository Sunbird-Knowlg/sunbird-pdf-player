import { $t, type TelemetryConfig } from '@project-sunbird/telemetry-sdk';
import { PlayerConfig } from '../interfaces';

export class TelemetryService {
  private contentSessionId: string;
  private playSessionId: string;
  private telemetryObject: any;
  private context: any;
  private config: any;
  private onTelemetryEvent?: (event: any) => void;

  constructor() {
    this.contentSessionId = this.uniqueId();
  }

  private uniqueId(length = 32) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  public initialize({ context, config, metadata }: PlayerConfig, onTelemetryEvent?: (event: any) => void) {
    this.context = context;
    this.config = config;
    this.onTelemetryEvent = onTelemetryEvent;
    this.playSessionId = this.uniqueId();

    if (!context) {
      return;
    }

    if (!$t.isInitialized) {
      const telemetryConfig: Partial<TelemetryConfig> = {
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
          { id: '2.0', type: 'PlayerVersion' }
        ]
      };

      const customDispatcher = {
        dispatch: (event: any) => {
          if (context.dispatcher) {
            context.dispatcher.dispatch(event);
          }
          if (this.onTelemetryEvent) {
            this.onTelemetryEvent(event);
          }
        }
      };
      telemetryConfig.dispatcher = customDispatcher;

      $t.initialize(telemetryConfig);
    }

    this.telemetryObject = {
      id: metadata.identifier,
      type: 'Content',
      ver: metadata.pkgVersion + '' || '1.0',
      rollup: context.objectRollup || {}
    };
  }

  public async start(duration: number) {
    if ($t.isInitialized) {
      const startData = {
        type: 'content',
        mode: 'play',
        pageid: '',
        duration: Number((duration / 1e3).toFixed(2))
      };
      await $t.start(
        {},
        this.telemetryObject.id,
        this.telemetryObject.ver,
        startData,
        {
          context: this.getEventContext(),
          object: this.telemetryObject
        }
      );
    }
  }

  public end(duration: number, currentPage: number, totalpages: number, visitedlength: number, endpageseen: boolean) {
    if ($t.isInitialized) {
      const durationSec = Number((duration / 1e3).toFixed(2));
      const endData = {
        type: 'content',
        mode: 'play',
        pageid: 'sunbird-player-Endpage',
        summary: [
          { progress: Number(((currentPage / totalpages) * 100).toFixed(0)) },
          { totallength: totalpages },
          { visitedlength },
          { visitedcontentend: currentPage === totalpages },
          { totalseekedlength: totalpages - visitedlength },
          { endpageseen }
        ],
        duration: durationSec
      };
      $t.end(endData, {
        context: this.getEventContext(),
        object: this.telemetryObject
      });
    }
  }

  public interact(id: string, currentPage: number) {
    if ($t.isInitialized) {
      $t.interact(
        {
          type: 'TOUCH',
          subtype: '',
          id,
          pageid: currentPage + ''
        },
        {
          context: this.getEventContext(),
          object: this.telemetryObject
        }
      );
    }
  }

  public heartbeat(data: any) {
    if ($t.isInitialized) {
        $t.heartbeat(data, {
            context: this.getEventContext(),
            object: this.telemetryObject
        });
    }
  }

  public impression(currentPage: number) {
    if ($t.isInitialized) {
      $t.impression(
        {
          type: 'workflow',
          subtype: '',
          pageid: currentPage + '',
          uri: ''
        },
        {
          context: this.getEventContext(),
          object: this.telemetryObject
        }
      );
    }
  }

  public error(error: any, data: { err: string; errtype: string }) {
    if ($t.isInitialized) {
      $t.error(
        {
          err: data.err,
          errtype: data.errtype,
          stacktrace: error?.toString() || ''
        },
        {
          context: this.getEventContext(),
          object: this.telemetryObject
        }
      );
    }
  }

  private getEventContext() {
    return {
      channel: this.context.channel || 'in.sunbird',
      pdata: this.context.pdata || { id: 'in.sunbird', ver: '1.0' },
      env: 'contentplayer',
      sid: this.context.sid,
      uid: this.context.uid,
      cdata: [
        ...(this.context.cdata || []),
        { id: this.contentSessionId, type: 'ContentSession' },
        { id: this.playSessionId, type: 'PlaySession' },
        { id: '2.0', type: 'PlayerVersion' }
      ],
      rollup: this.context.contextRollup || {}
    };
  }
}

export const telemetryService = new TelemetryService();
