import { Component, OnInit } from '@angular/core';
import { PlayerConfig, Metadata } from '../../projects/sunbird-pdf-player/src/lib/playerInterfaces';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'sunbird-pdf-player-app';
  pdfMetaDataConfig: any = JSON.parse(localStorage.getItem('config')) || {};
  config = {
    ...{
      traceId: 'afhjgh',
      sideMenu: {
        showShare: true,
        showDownload: true,
        showReplay: true,
        showExit: true
      }
    }, ...this.pdfMetaDataConfig
  };
  metadata: Metadata = {
    compatibilityLevel: 4,
    artifactUrl: 'https://obj.stage.sunbirded.org/sunbird-content-staging/content/assets/do_212995436595576832124/java_tutorial.pdf',
    identifier: 'do_31291455031832576019477',
    name: 'B301,B302_STD_1_TAMIL,ENGLISH_LANG_TERM 1_OPT',
    streamingUrl: 'https://obj.stage.sunbirded.org/sunbird-content-staging/content/assets/do_212995436595576832124/java_tutorial.pdf',
    pkgVersion: 1
  };
  pdfMetadataEvents: object;
  pdfPlayerConfig: PlayerConfig = {
    context: 
    {
      dispatcher: {
        dispatch(event) {
          console.log(`Events from dispatcher: ${JSON.stringify(event)}`);
        }
      },
      "mode": "play",
      "pdata": {
        "id": "dev.sunbird.portal",
        "ver": "5.2.0",
        "pid": "sunbird-portal"
      },
      "sid": "6d1898db-d783-4f83-8b92-4a36636e0d2f",
      "uid": "anonymous",
      "timeDiff": -0.089,
      "channel": "01269878797503692810",
      "tags": [
        "01269878797503692810"
      ],
      "did": "3ca74a4c5fbce6b7b7f5cd12cebb1682",
      "contextRollup": {
        "l1": "01269878797503692810"
      },
      "objectRollup": {},
      "userData": {
        "firstName": "Guest",
        "lastName": ""
      }
    },
    config: this.config,
    metadata: this.metadata
  };

  ngOnInit(): void {
  }



  pdfEventHandler(event) {

    console.log(JSON.stringify(event));
    this.pdfMetadataEvents = event;
    if (event.eid === 'END') {
      this.pdfMetaDataConfig = event.metaData;
      localStorage.setItem('config', JSON.stringify(this.pdfMetaDataConfig));
      this.pdfMetaDataConfig = JSON.parse(localStorage.getItem('config')) || {};
      this.config = {
        ...{
          traceId: 'afhjgh',
          sideMenu: {
            showShare: true,
            showDownload: true,
            showReplay: true,
            showExit: true
          }
        }, ...this.pdfMetaDataConfig
      };
      this.pdfPlayerConfig.config = this.config;
    }

    if (event?.edata?.type === 'PRINT') {
      const windowFrame = window.document.querySelector('pdf-viewer iframe');
      if (windowFrame) {
        // eslint-disable-next-line @typescript-eslint/dot-notation
        windowFrame['contentWindow'].print();
      }
    }
  }
  telemetryEvent(event) {
    console.log('in app: ', JSON.stringify(event));
  }

}
