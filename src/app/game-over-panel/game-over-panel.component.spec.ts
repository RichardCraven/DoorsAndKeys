import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameOverPanelComponent } from './game-over-panel.component';

describe('GameOverPanelComponent', () => {
  let component: GameOverPanelComponent;
  let fixture: ComponentFixture<GameOverPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameOverPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameOverPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
