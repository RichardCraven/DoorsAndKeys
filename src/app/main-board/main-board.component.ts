import { Component, OnInit, HostListener } from '@angular/core';
import {TileComponent} from '../tile/tile.component'
import {PlayerManagerService} from '../services/player-manager.service'
import { Subscription } from 'rxjs';
@Component({
  selector: 'main-board',
  templateUrl: './main-board.component.html',
  styleUrls: ['./main-board.component.css']
})
export class MainBoardComponent implements OnInit {
  newPlayerSubscription: Subscription;
  totalTiles = 225;
  idCount = 0;
  tiles = [];
  items = [
    
    'skull',
    'key',
    'disguise',
    'lantern',
    // 'buddha',
    'stairs',
    'cloud',
    // 'palm_tree',
    'door',
    'monster',
    'crown'
  ];
  boardInventory = {
    monster: 5,
    key: 2,
    skull: 1,
    crown: 1,
    lantern: 3,
    disguise: 2,
    buddha: 0,
    stairs: 1,
    door: 2,
    cloud: 1
  }
  constructor(public playerManager: PlayerManagerService) { }

  ngOnInit() {
    var DOMboard = document.querySelector('.board')
    for (let i = 0; i<this.totalTiles; i++){
      var tile = {
        id : this.idCount,
        empty: true,
        occupied : false,
        buildable : false,
        contains: '',
        door: false,
        stairs: false,
        cloud: false,
        palm_tree: false,
        crown: false,
        skull: false,
        key: false,
        lantern: false,
        disguise: false,
        buddha: false,
        visible: false,
        monster: false,
        edge: false
      }
      this.tiles.push(tile)
      this.idCount++
    }
    for(let i = 0; i <this.items.length; i++){
      while(this.boardInventory[this.items[i]] > 0){
        let num = Math.floor(Math.random() * this.tiles.length)
        let tile = this.tiles[num]
        if(tile.empty){
          tile.contains = this.items[i]
          tile[this.items[i]] = true;
          tile.empty = false;
          this.boardInventory[this.items[i]]--
        } 
      }
    }

    //DEFINING EDGES, NEED TO CHANGE THIS IF YOU CHANGE BOARD SIZE
    const tiles = this.tiles;
    for(var t in tiles){
      if(tiles[t].id >= 0 &&  tiles[t].id <= 14){
        tiles[t].edge = 'top'
      }
      if(tiles[t].id >= 210 && tiles[t].id <= 224){
        tiles[t].edge = 'bottom'
      }
      if(tiles[t].id %15 === 0){
        tiles[t].edge = 'left'
      }
      if((tiles[t].id-14)%15 === 0){
        tiles[t].edge = 'right'
      }
    }
    this.playerManager.getPlayerActivity(this.tiles).subscribe(res => {
      
      const tile = this.tiles[res.location]
      tile.empty = false;
      tile.visible = true;
      tile.occupied = true;
      
      if(res.old_location || res.old_location === 0){
        const old_tile = this.tiles[res.old_location]
        old_tile.empty = true;
        old_tile.visible = false;
        old_tile.occupied = false;
      }
      for(let i = 0; i < this.tiles.length; i++){
        this.tiles[i].visible = false;
      }
      if(res.visibility){
        for(let v = 0; v < res.visibility.length; v++){
          // console.log(res.visibility[v]);
          if(this.tiles[res.visibility[v]]) this.tiles[res.visibility[v]].visible = true;
        }
      }
    })
    this.playerManager.newPlayer()

    const crownAbsent = false;
  }
  onEnterKey($event){
    console.log('WAYOOO, event is ', $event);
    
  }
  isEmpty(target){
    console.log('empty: ',target.empty);
  }
  isId(target){
    console.log('id: ',target.id);
  }
}
