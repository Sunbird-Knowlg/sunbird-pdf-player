import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { DoBootstrap, Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { PLAYER_CONFIG, SunbirdPlayerSdkModule } from '@project-sunbird/sunbird-player-sdk-v9';
import { SunbirdPdfPlayerComponent, SunbirdPdfPlayerModule } from '@project-sunbird/sunbird-pdf-player-v9';

@NgModule({
  declarations: [
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    SunbirdPlayerSdkModule,
    SunbirdPdfPlayerModule
  ],
  providers: [{ provide: PLAYER_CONFIG, useValue: { contentCompatibilityLevel: 5 } }],
})
export class AppModule implements DoBootstrap {
  constructor(private injector: Injector) { }
  ngDoBootstrap() {
    const customElement = createCustomElement(SunbirdPdfPlayerComponent, { injector: this.injector });
    customElements.define('sunbird-pdf-player', customElement);
  }
}

