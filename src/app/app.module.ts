import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import{PlayerManagerService} from './services/player-manager.service'
import { MainBoardComponent } from './main-board/main-board.component';
import { TileComponent } from './tile/tile.component';
import { InfoPanelComponent } from './info-panel/info-panel.component';

@NgModule({
  declarations: [
    AppComponent,
    MainBoardComponent,
    TileComponent,
    InfoPanelComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [PlayerManagerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
