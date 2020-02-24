import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { MainBoardComponent } from './main-board/main-board.component';
import { InfoPanelComponent } from './info-panel/info-panel.component';
import { DeathScreenComponent } from './death-screen/death-screen.component';
import { InventoryPanelComponent } from './inventory-panel/inventory-panel.component';
describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        MainBoardComponent,
        InfoPanelComponent,
        DeathScreenComponent,
        InventoryPanelComponent
      ],
    }).compileComponents();

    // describe('AppComponent', () => {
    //   beforeEach(async(() => {
    //       TestBed.configureTestingModule({
    //         declarations: [
    //           AppComponent,
    //           NavComponent
    //         ]
    //       }).compileComponents();
    //     }));
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
  it(`should have as title 'DoorsAndKeys'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('DoorsAndKeys');
  }));
  it('should render title in a h1 tag', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Welcome to DoorsAndKeys!');
  }));
});
