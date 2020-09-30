import { Component, OnInit } from '@angular/core';
import { SunbirdPdfPlayerService } from '../sunbird-pdf-player.service';

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  constructor(public pdfPlayerService: SunbirdPdfPlayerService) { }

  ngOnInit() {
  }

  closeNav() {
    const inputChecked = document.getElementById('overlay-input') as HTMLInputElement;
    inputChecked.checked = false; 
    document.getElementById('pdfPlayerSideMenu').style.visibility = 'hidden';
    document.querySelector<HTMLElement>('.navBlock').style.marginLeft = '-100%';
    this.pdfPlayerService.raiseHeartBeatEvent('CLOSE_MENU');
  }

  openPdfDownloadPopup() {
    this.pdfPlayerService.showDownloadPopup = true;
    this.pdfPlayerService.raiseHeartBeatEvent('DOWNLOAD_MENU');
  }

}
