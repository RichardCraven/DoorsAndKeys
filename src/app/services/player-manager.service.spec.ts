import { TestBed } from '@angular/core/testing';

import { PlayerManagerService } from './player-manager.service';

describe('PlayerManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PlayerManagerService = TestBed.get(PlayerManagerService);
    expect(service).toBeTruthy();
  });
});
