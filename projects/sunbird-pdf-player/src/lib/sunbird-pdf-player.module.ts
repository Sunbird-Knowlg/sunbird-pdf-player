import { FormsModule } from '@angular/forms';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SunbirdPdfPlayerComponent } from './sunbird-pdf-player.component';
import { PdfViewerComponent } from './pdf-viewer/pdf-viewer.component';
import { PLAYER_CONFIG, SunbirdPlayerSdkModule } from '@project-sunbird/sunbird-player-sdk-v9';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    SunbirdPlayerSdkModule,
    SunbirdPdfPlayerComponent,
    PdfViewerComponent
  ],
  providers: [{ provide: PLAYER_CONFIG, useValue: { contentCompatibilityLevel: 5 } }],
  exports: [SunbirdPdfPlayerComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SunbirdPdfPlayerModule { }
