import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CombatBoardComponent } from './combat-board.component';

describe('CombatBoardComponent', () => {
  let component: CombatBoardComponent;
  let fixture: ComponentFixture<CombatBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CombatBoardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CombatBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
