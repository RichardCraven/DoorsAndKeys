import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CombatTileComponent } from './combat-tile.component';

describe('CombatTileComponent', () => {
  let component: CombatTileComponent;
  let fixture: ComponentFixture<CombatTileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CombatTileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CombatTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
