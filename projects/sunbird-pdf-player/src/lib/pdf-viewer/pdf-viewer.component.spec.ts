import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PdfViewerComponent } from './pdf-viewer.component';

describe('PdfViewerComponent', () => {
  let component: PdfViewerComponent;
  let fixture: ComponentFixture<PdfViewerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [PdfViewerComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PdfViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('#pagesLoadedCallback should emit viewerEvent', () => {
    // eslint-disable-next-line @typescript-eslint/dot-notation
    component['progressInterval'] = 123;
    spyOn(component.viewerEvent, 'emit');
    const data = {};
    // eslint-disable-next-line @typescript-eslint/dot-notation
    component['pagesLoadedCallback']({});
    expect(component.viewerEvent.emit).toHaveBeenCalledWith({ type: 'progress', data: 100 });
    expect(component.viewerEvent.emit).toHaveBeenCalledWith({ type: 'pagesloaded', data });
  });
  it('#ngAfterViewInit and should define iframe', () => {
    component.ngAfterViewInit();
    component.src = 'anc.com';
    component.pdfURL = 'samplepdfcontent.doId.pdf';
    expect(component.iframeRef).toBeDefined();
  });

  it('#ngAfterViewInit and should call for INVALID_PAGE_ERROR', () => {
    spyOn(component.viewerEvent, 'emit').and.callThrough();
    component.actions.emit({ type: 'INVALID_PAGE_ERROR', data: '' });
    component.ngAfterViewInit();
    expect(component.viewerEvent.emit).toHaveBeenCalledWith({ type: 'INVALID_PAGE_ERROR', data: false });
    expect(component.iframeRef).toBeDefined();
  });
  it('#ngAfterViewInit and should call for NAVIGATE_TO_PAGE', () => {
    spyOn(component.viewerEvent, 'emit').and.callThrough();
    // eslint-disable-next-line @typescript-eslint/dot-notation
    component['viewerApp'] = {
      page: true
    };
    component.actions.emit({ type: 'NAVIGATE_TO_PAGE', data: true });
    component.ngAfterViewInit();
    expect(component.viewerEvent.emit).toHaveBeenCalledWith({ type: 'INVALID_PAGE_ERROR', data: true });
  });
  it('#registerForEvents and should call for pagesloaded', () => {
    spyOn<any>(component, 'ListenToPageScroll');
    // eslint-disable-next-line @typescript-eslint/dot-notation
    component['viewerApp'] = {
      pdfViewer: {
        pagesRotation: '90'
      },
      eventBus: {
        on: jasmine.createSpy('on').and.callFake((event, callback) => {
          callback('pagesloaded', 'successResponse');
        })
      }
    };
    component.registerForEvents();
    expect(component.iframeRef).toBeDefined();
    setTimeout(() => {
    // eslint-disable-next-line @typescript-eslint/dot-notation
    expect(component['ListenToPageScroll']).toHaveBeenCalled();
    // eslint-disable-next-line @typescript-eslint/dot-notation
    expect(component['viewerApp'].rotatePages).toHaveBeenCalled();
  }, 500);
  });
  it('#ListenToPageScroll should not emit viewerEvent', () => {
    spyOn(component.viewerEvent, 'emit');
    // eslint-disable-next-line @typescript-eslint/dot-notation
    component['ListenToPageScroll']();
    expect(component.viewerEvent.emit).not.toHaveBeenCalledWith({ type: 'pageend' });
  });
});
