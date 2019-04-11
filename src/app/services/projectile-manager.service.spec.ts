import { TestBed } from '@angular/core/testing';

import { ProjectileManagerService } from './projectile-manager.service';

describe('ProjectileManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProjectileManagerService = TestBed.get(ProjectileManagerService);
    expect(service).toBeTruthy();
  });
});
