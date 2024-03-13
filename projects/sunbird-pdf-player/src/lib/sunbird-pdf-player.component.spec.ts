import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SunbirdPdfPlayerComponent } from './sunbird-pdf-player.component';
import { NO_ERRORS_SCHEMA, Renderer2 } from '@angular/core';
import { ViewerService } from './services/viewer.service';
import { SunbirdPdfPlayerService } from './sunbird-pdf-player.service';
import { mockData } from '../lib/services/viewer.service.spec.data';
import { SimpleChanges, SimpleChange } from '@angular/core';
import { PLAYER_CONFIG } from '@project-sunbird/sunbird-player-sdk-v9';

describe('SunbirdPdfPlayerComponent', () => {
  let component: SunbirdPdfPlayerComponent;
  let fixture: ComponentFixture<SunbirdPdfPlayerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SunbirdPdfPlayerComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [ViewerService, SunbirdPdfPlayerService, {
        provide: PLAYER_CONFIG, useValue: {contentCompatibilityLevel: 5}
      }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SunbirdPdfPlayerComponent);
    component = fixture.componentInstance;
    component.playerConfig = mockData.playerConfig;
    fixture.detectChanges();
  });

  it('should initialize player config', () => {
    const sunbirdPdfPlayerService = TestBed.inject(SunbirdPdfPlayerService);
    const viewerService = TestBed.inject(ViewerService);
    spyOn(sunbirdPdfPlayerService, 'initialize');
    spyOn(viewerService, 'initialize');
    component.ngOnInit();
    expect(component.viewState).toEqual('start');
    expect(sunbirdPdfPlayerService.initialize).toHaveBeenCalled();
    expect(viewerService.initialize).toHaveBeenCalled();
  });

  it('should show controls on mouse enter', () => {
    const renderer2Stub: Renderer2 = fixture.debugElement.injector.get(Renderer2);
    spyOn(renderer2Stub, 'listen');
    component.ngAfterViewInit();
    const event = new MouseEvent('mouseenter', {});
    component.pdfPlayerRef.nativeElement.dispatchEvent(event);
    fixture.detectChanges();
    expect(renderer2Stub.listen).toHaveBeenCalled();
    expect(component.showControls).toBeTruthy();
  });

  it('should hide controls on mouse leave', () => {
    const renderer2Stub: Renderer2 = fixture.debugElement.injector.get(Renderer2);
    const viewerService = TestBed.inject(ViewerService);
    spyOn(viewerService, 'raiseExceptionLog').and.callThrough();
    spyOn(component.errorService, 'checkContentCompatibility').and.returnValues({isCompitable: true, error: new Error ('error') });
    component.playerConfig.metadata.compatibilityLevel = 4;
    spyOn(renderer2Stub, 'listen');
    component.ngAfterViewInit();
    const event = new MouseEvent('mouseleave', {});
    component.pdfPlayerRef.nativeElement.dispatchEvent(event);
    fixture.detectChanges();
    expect(renderer2Stub.listen).toHaveBeenCalled();
    expect(component.showControls).toBeFalsy();
  });

  it('should call header action for zoom', () => {
    spyOn(component.viewerActions, 'emit');
    const viewerService = TestBed.inject(ViewerService);
    spyOn(viewerService, 'raiseHeartBeatEvent');
    component.headerActions({ type: 'ZOOM_IN', data: '' });
    expect(component.viewerActions.emit).toHaveBeenCalled();
    expect(viewerService.raiseHeartBeatEvent).toHaveBeenCalled();
  });

  it('should call header action for NEXT event', () => {
    component.viewerService.currentPagePointer = 4;
    component.viewerService.totalNumberOfPages = 4;
    const viewerService = TestBed.inject(ViewerService);
    spyOn(viewerService, 'raiseEndEvent').and.callFake(() => {});
    component.headerActions({ type: 'NEXT', data: '' });
    expect(viewerService.raiseEndEvent).toHaveBeenCalled();
  });

  xit('should call header action for NEXT event and end page', () => {
    spyOn(component.viewerActions, 'emit');
    const viewerService = TestBed.inject(ViewerService);
    spyOn(viewerService, 'raiseHeartBeatEvent');
    spyOn(viewerService, 'raiseEndEvent').and.callFake(() => {});
    viewerService.totalNumberOfPages = 1;
    component.headerActions({ type: 'NEXT', data: '' });
    expect(component.viewerActions.emit).toHaveBeenCalled();
    expect(viewerService.raiseHeartBeatEvent).toHaveBeenCalled();
    expect(viewerService.raiseEndEvent).toHaveBeenCalled();
    expect(viewerService.endPageSeen).toBeTruthy();
  });

  it('should call sideBarEvents', () => {
    spyOn(component.viewerActions, 'emit');
    const viewerService = TestBed.inject(ViewerService);
    spyOn(viewerService, 'raiseHeartBeatEvent');
    component.sideBarEvents({});
    expect(component.viewerActions.emit).toHaveBeenCalled();
    expect(viewerService.raiseHeartBeatEvent).toHaveBeenCalled();
  });

  it('should replay content', () => {
    spyOn(component.viewerActions, 'emit');
    const viewerService = TestBed.inject(ViewerService);
    spyOn(viewerService, 'raiseHeartBeatEvent');
    component.playerConfig = mockData.playerConfig;
    spyOn(component, 'ngOnInit');
    component.replayContent({ type: 'REPLAY' });
    expect(component.viewerActions.emit).toHaveBeenCalled();
    expect(viewerService.raiseHeartBeatEvent).toHaveBeenCalled();
    expect(component.ngOnInit).toHaveBeenCalled();
  });

  it('should call on pdf load and raise start event', () => {
    const viewerService = TestBed.inject(ViewerService);
    spyOn(viewerService, 'raiseStartEvent');
    component.onPdfLoaded({ type: 'LOAD' });
    expect(component.viewState).toEqual('player');
    expect(viewerService.raiseStartEvent).toHaveBeenCalled();
  });

  it('should call on pdf load fail and raise error event', () => {
    const viewerService = TestBed.inject(ViewerService);
    spyOn(viewerService, 'raiseExceptionLog').and.callThrough();
    component.onPdfLoadFailed(new Error());
    expect(component.viewState).toEqual('start');
    expect(viewerService.raiseExceptionLog).toHaveBeenCalled();
  });

  it('should call onZoomChange', () => {
    const viewerService = TestBed.inject(ViewerService);
    spyOn(viewerService, 'pageSessionUpdate');
    spyOn(viewerService, 'raiseHeartBeatEvent');
    component.onZoomChange(1);
    expect(viewerService.pageSessionUpdate).toHaveBeenCalled();
    expect(viewerService.raiseHeartBeatEvent).toHaveBeenCalled();
  });

  it('should raise raiseHeartBeatEvent onPdfDownloaded', () => {
    const viewerService = TestBed.inject(ViewerService);
    spyOn(viewerService, 'raiseHeartBeatEvent');
    component.onPdfDownloaded();
    expect(viewerService.raiseHeartBeatEvent).toHaveBeenCalled();
  });

  it('should raise raiseHeartBeatEvent onAfterPrint', () => {
    const viewerService = TestBed.inject(ViewerService);
    spyOn(viewerService, 'raiseHeartBeatEvent');
    component.onAfterPrint();
    expect(viewerService.raiseHeartBeatEvent).toHaveBeenCalled();
  });

  it('should raise raiseHeartBeatEvent onRotationChange', () => {
    const viewerService = TestBed.inject(ViewerService);
    spyOn(viewerService, 'raiseHeartBeatEvent');
    spyOn(viewerService, 'pageSessionUpdate');
    component.onRotationChange({ type: 'rotatecw' });
    expect(viewerService.raiseHeartBeatEvent).toHaveBeenCalled();
    expect(viewerService.pageSessionUpdate).toHaveBeenCalled();
  });

  it('should raise raiseHeartBeatEvent onPageChange', () => {
    const viewerService = TestBed.inject(ViewerService);
    spyOn(viewerService, 'raiseHeartBeatEvent');
    spyOn(viewerService, 'pageSessionUpdate');
    component.onPageChange({ pageNumber: 2 });
    expect(viewerService.raiseHeartBeatEvent).toHaveBeenCalled();
    expect(viewerService.pageSessionUpdate).toHaveBeenCalled();
  });

  it('should call viewer events', () => {
    const viewerService = TestBed.inject(ViewerService);
    component.viewerEvent({ type: 'progress', data: 0 });
    expect(viewerService.loadingProgress).toEqual(0);
  });

  it('should call viewer events for pagesloaded', () => {
    spyOn(component, 'onPdfLoaded');
    component.viewerEvent({ type: 'pagesloaded', data: '' });
    expect(component.onPdfLoaded).toHaveBeenCalled();
  });

  it('should call viewer events for pagechanging', () => {
    spyOn(component, 'onPageChange');
    component.viewerEvent({ type: 'pagechanging', data: '' });
    expect(component.onPageChange).toHaveBeenCalled();
  });

  it('should call viewer events for rotatecw', () => {
    spyOn(component, 'onRotationChange');
    component.viewerEvent({ type: 'rotatecw', data: '' });
    expect(component.onRotationChange).toHaveBeenCalled();
  });

  it('should call viewer events for pageend', () => {
    const viewerService = TestBed.inject(ViewerService);
    spyOn(viewerService, 'raiseEndEvent');
    component.viewerEvent({ type: 'pageend', data: '' });
    expect(viewerService.endPageSeen).toBeTruthy();
  });

  it('should call viewer events for INVALID_PAGE_ERROR', () => {
    spyOn(component, 'resetValidPage').and.callThrough();
    component.viewerEvent({ type: 'INVALID_PAGE_ERROR', data: true });
    expect(component.resetValidPage).toHaveBeenCalled();
    expect(component.validPage).toBe(true);
  });
  it('should call viewer events for INVALID_PAGE_ERROR and should not call onPdfLoadFailed', () => {
    spyOn(component, 'resetValidPage').and.callThrough();
    spyOn(component, 'onPdfLoadFailed');
    component.viewerEvent({ type: 'INVALID_PAGE_ERROR', data: true });
    expect(component.onPdfLoadFailed).not.toHaveBeenCalled();
    expect(component.validPage).not.toBe(false);
  });
  it('should call onTelemetryEvent and emit telemetryEvent', () => {
    spyOn(component.telemetryEvent, 'emit').and.callThrough();
    component.onTelemetryEvent({ details: 'abc' });
    expect(component.telemetryEvent.emit).toHaveBeenCalled();
  });
  it('should call playContent and emit raiseHeartBeatEvent event', () => {
    spyOn(component.viewerService, 'raiseHeartBeatEvent');
    component.playContent({ type: 'error' });
    expect(component.viewerService.raiseHeartBeatEvent).toHaveBeenCalledWith('error');
  });
  it('should call exitContent and emit raiseHeartBeatEvent event', () => {
    spyOn(component.viewerService, 'raiseHeartBeatEvent');
    component.exitContent({ type: 'error' });
    expect(component.viewerService.raiseHeartBeatEvent).toHaveBeenCalledWith('error');
  });
  it('should call ngOnDestroy', () => {
    spyOn(component.viewerService, 'raiseEndEvent');
    component.ngOnDestroy();
    expect(component.viewerService.isEndEventRaised).toBeFalsy();
  });
  it('should call viewer events for error', () => {
    spyOn(component, 'onPdfLoadFailed');
    component.viewerEvent({ type: 'error', data: '' });
    expect(component.onPdfLoadFailed).toHaveBeenCalled();
  });
  it('should call ngOnChanges and emit viewerActions', () => {
    component.isInitialized = true;
    const changes: SimpleChanges = {
      action: new SimpleChange('play', 'view', true),
      playerConfig: new SimpleChange('play', 'view', true)
    };
    spyOn(component, 'ngOnInit');
    spyOn(component.viewerActions, 'emit').and.callThrough();
    component.ngOnChanges(changes);
    expect(component.ngOnInit).toHaveBeenCalled();
    expect(component.viewerActions.emit).toHaveBeenCalledWith({type: changes.action});
  });
  it('should call resetValidPage', () => {
    spyOn(component['cdRef'], 'detectChanges');
    component.resetValidPage();
    expect(component.validPage).toBeTruthy();
  });

  it('player config should have metadata object', () => {
    const sunbirdPdfPlayerService = TestBed.inject(SunbirdPdfPlayerService);
    const viewerService = TestBed.inject(ViewerService);
    spyOn(sunbirdPdfPlayerService, 'initialize');
    spyOn(viewerService, 'initialize');
    component.ngOnInit();
    expect(Object.keys(component.playerConfig)).toContain('metadata');
    expect(sunbirdPdfPlayerService.initialize).toHaveBeenCalled();
    expect(viewerService.initialize).toHaveBeenCalled();
  });

  it('config and context should optional property for player and metadata should be mandatory field', () => {
    component.playerConfig = {
      metadata: {identifier: 'do_testId', name: 'test_name', artifactUrl: 'testArtifact url'}
    };
    const sunbirdPdfPlayerService = TestBed.inject(SunbirdPdfPlayerService);
    const viewerService = TestBed.inject(ViewerService);
    spyOn(sunbirdPdfPlayerService, 'initialize');
    spyOn(viewerService, 'initialize');
    component.ngOnInit();
    expect(Object.keys(component.playerConfig)).not.toContain('context');
    expect(Object.keys(component.playerConfig)).not.toContain('config');
    expect(Object.keys(component.playerConfig)).toContain('metadata');
    expect(sunbirdPdfPlayerService.initialize).toHaveBeenCalled();
    expect(viewerService.initialize).toHaveBeenCalled();
  });

  it('player config metadata should have the identifer, name, artifactUrl', () => {
    component.playerConfig = {
      metadata: {identifier: 'do_testId', name: 'test_name', artifactUrl: 'testArtifact url'}
    };
    const sunbirdPdfPlayerService = TestBed.inject(SunbirdPdfPlayerService);
    const viewerService = TestBed.inject(ViewerService);
    spyOn(sunbirdPdfPlayerService, 'initialize');
    spyOn(viewerService, 'initialize');
    component.ngOnInit();
    expect(Object.keys(component.playerConfig.metadata)).toContain('identifier');
    expect(Object.keys(component.playerConfig.metadata)).toContain('name');
    expect(Object.keys(component.playerConfig.metadata)).toContain('artifactUrl');
    expect(sunbirdPdfPlayerService.initialize).toHaveBeenCalled();
    expect(viewerService.initialize).toHaveBeenCalled();
  });
});
