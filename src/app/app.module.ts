import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppComponent } from './app.component';

import{PlayerManagerService} from './services/player-manager.service'
import { MainBoardComponent } from './main-board/main-board.component';
import { TileComponent } from './tile/tile.component';
import { InfoPanelComponent } from './info-panel/info-panel.component';
import { CombatBoardComponent } from './combat-board/combat-board.component';
import { InventoryPanelComponent } from './inventory-panel/inventory-panel.component';
import { GameOverPanelComponent } from './game-over-panel/game-over-panel.component';
import { DeathScreenComponent } from './death-screen/death-screen.component';
import { CombatTile } from './combat-board/combat-tile/combat-tile.component';

@NgModule({
  declarations: [
    AppComponent,
    MainBoardComponent,
    TileComponent,
    InfoPanelComponent,
    CombatBoardComponent,
    InventoryPanelComponent,
    GameOverPanelComponent,
    DeathScreenComponent,
    CombatTile
  ],
  imports: [
    BrowserModule
  ],
  providers: [PlayerManagerService],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class AppModule { }
