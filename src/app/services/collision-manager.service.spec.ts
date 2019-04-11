import { TestBed } from '@angular/core/testing';

import { CollisionManagerService } from './collision-manager.service';

describe('ImpactManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CollisionManagerService = TestBed.get(CollisionManagerService);
    expect(service).toBeTruthy();
  });
});
