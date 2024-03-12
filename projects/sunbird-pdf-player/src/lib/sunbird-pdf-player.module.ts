import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SunbirdPdfPlayerComponent } from './sunbird-pdf-player.component';
import { PdfViewerComponent } from './pdf-viewer/pdf-viewer.component';
import { PLAYER_CONFIG, SunbirdPlayerSdkModule  } from '@project-sunbird/sunbird-player-sdk-v9';

@NgModule({
  declarations: [
    SunbirdPdfPlayerComponent, PdfViewerComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SunbirdPlayerSdkModule
  ],
  providers: [{provide: PLAYER_CONFIG, useValue: {contentCompatibilityLevel: 5}}],
  exports: [SunbirdPdfPlayerComponent]
})
export class SunbirdPdfPlayerModule { }
