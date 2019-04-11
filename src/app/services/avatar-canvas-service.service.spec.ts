import { TestBed } from '@angular/core/testing';

import { AvatarCanvasServiceService } from './avatar-canvas-service.service';

describe('AvatarCanvasServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AvatarCanvasServiceService = TestBed.get(AvatarCanvasServiceService);
    expect(service).toBeTruthy();
  });
});
