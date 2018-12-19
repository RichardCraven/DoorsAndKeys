import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'combat-board',
  templateUrl: './combat-board.component.html',
  styleUrls: ['./combat-board.component.css']
})
export class CombatBoardComponent implements OnInit {
  topTilesCount = 10;
  botTilesCount = 10;
  gridTilesCount = 100;
  topTiles = [];
  botTiles = [];
  gridTiles = [];
  @Input()monster
  
  // set monster(monster: string) {
  //   this.engagedMonster = (name)
  // }
 
  // get monster(): string { return this.engagedMonster; }

  constructor() { }

  ngOnInit() {
    console.log('initting combat board');
    
    for(let t = 0; t < this.topTilesCount; t++){
      let tile = {
        id : t,
        contains: null,
        visible : false
      }
      this.topTiles.push(tile)
    }
    for(let b = 0; b < this.botTilesCount; b++){
      let tile = {
        id : b,
        contains: null,
        visible : false
      }
      this.botTiles.push(tile)
    }
    for(let g = 0; g < this.gridTilesCount; g++){
      let tile = {
        id : g,
        contains: null,
        visible : false
      }
      this.gridTiles.push(tile)
    }

    console.log(this.botTiles);
    console.log(this.topTiles);
    console.log(this.gridTiles);
    // console.log(this.engagedMonster);
    this.topTiles[4][this.monster] = true;
    this.topTiles[4].visible = true;

    this.botTiles[5].visible = true;
    this.botTiles[5].occupied = true;
  }
  clickTile(tile){
    console.log(tile);
    
  }
}
