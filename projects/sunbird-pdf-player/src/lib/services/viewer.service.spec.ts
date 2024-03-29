import { TestBed } from '@angular/core/testing';
import { ViewerService } from './viewer.service';
import { SunbirdPdfPlayerService } from '../sunbird-pdf-player.service';
import { UtilService } from './util.service';
import { mockData } from './viewer.service.spec.data';

describe('ViewerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UtilService, SunbirdPdfPlayerService]
    });
  });

  it('should be created', () => {
    const service: ViewerService = TestBed.inject(ViewerService);
    expect(service).toBeTruthy();
  });

  xit('should initialize player config', () => {
    const service = TestBed.inject(ViewerService);
    service.initialize(mockData.playerConfig);
    expect(service.src).toEqual(mockData.playerConfig.metadata.artifactUrl);
    expect(service.endPageSeen).toBeFalsy();
    expect(service.loadingProgress).toEqual(0);
  });

  it('should update metadata for page session ', () => {
    const service = TestBed.inject(ViewerService);
    service.initialize(mockData.playerConfig);
    service.pageSessionUpdate();
    expect(service?.currentPagePointer).toEqual(1);
  });

  it('should raise Start event ', () => {
    const service = TestBed.inject(ViewerService);
    const sunbirdPdfPlayerService = TestBed.inject(SunbirdPdfPlayerService);
    spyOn(sunbirdPdfPlayerService, 'initialize').and.callThrough();
    spyOn(sunbirdPdfPlayerService, 'start');
    spyOn(service.playerEvent, 'emit');
    sunbirdPdfPlayerService.initialize(mockData.playerConfig);
    service.initialize(mockData.playerConfig);
    service.raiseStartEvent({pagesCount: 68});
    expect(service.playerEvent.emit).toHaveBeenCalled();
    expect(sunbirdPdfPlayerService.initialize).toHaveBeenCalled();
    expect(sunbirdPdfPlayerService.start).toHaveBeenCalled();
  });

  it('should raise End event ', () => {
    const service = TestBed.inject(ViewerService);
    const sunbirdPdfPlayerService = TestBed.inject(SunbirdPdfPlayerService);
    spyOn(sunbirdPdfPlayerService, 'initialize').and.callThrough();
    spyOn(sunbirdPdfPlayerService, 'end');
    spyOn(service.playerEvent, 'emit');
    sunbirdPdfPlayerService.initialize(mockData.playerConfig);
    service.initialize(mockData.playerConfig);
    service.totalNumberOfPages = 68;
    service.raiseEndEvent();
    expect(service.playerEvent.emit).toHaveBeenCalled();
    expect(sunbirdPdfPlayerService.initialize).toHaveBeenCalled();
    expect(sunbirdPdfPlayerService.end).toHaveBeenCalled();
  });

  it('should raise Heart Beat Event', () => {
    const service = TestBed.inject(ViewerService);
    const sunbirdPdfPlayerService = TestBed.inject(SunbirdPdfPlayerService);
    spyOn(sunbirdPdfPlayerService, 'initialize').and.callThrough();
    spyOn(sunbirdPdfPlayerService, 'interact');
    spyOn(sunbirdPdfPlayerService, 'heartBeat');
    sunbirdPdfPlayerService.initialize(mockData.playerConfig);
    service.initialize(mockData.playerConfig);
    service.raiseHeartBeatEvent('ZOOM_IN');
    expect(sunbirdPdfPlayerService.initialize).toHaveBeenCalled();
    expect(sunbirdPdfPlayerService.interact).toHaveBeenCalled();
    expect(sunbirdPdfPlayerService.heartBeat).toHaveBeenCalled();
  });

  it('should raise Heart Beat Event for PAGE_CHANGE', () => {
    const service = TestBed.inject(ViewerService);
    const sunbirdPdfPlayerService = TestBed.inject(SunbirdPdfPlayerService);
    spyOn(sunbirdPdfPlayerService, 'initialize').and.callThrough();
    spyOn(sunbirdPdfPlayerService, 'impression');
    spyOn(sunbirdPdfPlayerService, 'heartBeat');
    sunbirdPdfPlayerService.initialize(mockData.playerConfig);
    service.initialize(mockData.playerConfig);
    service.raiseHeartBeatEvent('PAGE_CHANGE');
    expect(sunbirdPdfPlayerService.initialize).toHaveBeenCalled();
    expect(sunbirdPdfPlayerService.impression).toHaveBeenCalled();
    expect(sunbirdPdfPlayerService.heartBeat).toHaveBeenCalled();
  });

  it('should raise Error event', () => {
    const service = TestBed.inject(ViewerService);
    const sunbirdPdfPlayerService = TestBed.inject(SunbirdPdfPlayerService);
    spyOn(sunbirdPdfPlayerService, 'initialize').and.callThrough();
    spyOn(sunbirdPdfPlayerService, 'error');
    spyOn(service.playerEvent, 'emit');
    sunbirdPdfPlayerService.initialize(mockData.playerConfig);
    service.initialize(mockData.playerConfig);
    service.raiseExceptionLog('error', 'clinet_error', {}, 'trace_1');
    expect(service.playerEvent.emit).toHaveBeenCalled();
    expect(sunbirdPdfPlayerService.error).toHaveBeenCalled();
  });

  it('if context or context.userdata is not available default Anonymous should log as a username', () => {
    const service = TestBed.inject(ViewerService);
    service.initialize(mockData.playerConfig);
    expect(service.userName).toEqual("Anonymous");
  });

  it('if context or context.userdata is available user firstname and last name should log as a username', () => {
    const service = TestBed.inject(ViewerService);
    service.initialize(mockData.optionalPlayerConfig);
    expect(service.userName).toEqual("Harish Kumar Gangula");
  });
});
