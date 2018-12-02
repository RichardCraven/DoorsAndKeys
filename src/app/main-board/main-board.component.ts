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
    'crown',
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
    '', '', '', '','','','', '', '', '',''
  ];
  boardInventory = {
    monsters: 0,
    keys: 0,
    skulls: 0,
    crowns: 0,
    lanterns: 0,
    disguises: 0,
    buddhas: 0,
    stairs: 0,
    doors: 0,
    clouds: 0
  }
  constructor(public playerManager: PlayerManagerService) { }

  ngOnInit() {
    var DOMboard = document.querySelector('.board')
    for (let i = 0; i<this.totalTiles; i++){
      var num = Math.floor(Math.random() * this.items.length)  
      if(num === 0){
        if(Math.floor(Math.random()) + 0.3){
          console.log('crown')
          num = num
        }else {
          num = Math.floor(Math.random() * this.items.length)
        }
      } 
      // console.log(num);
      
      var tile = {
        name : '',
        id : this.idCount,
        occupied : false,
        empty: true,
        buildable : false,
        contains: this.items[num],
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
        edge: false,
        class: ''
      }
      const items = this.items;
      if(items[num] === 'crown') items.splice(num, 1)
      // tile.class = tile.contains
      // tile.class = tit
      // tile.contains = '';
      switch(tile.contains){
        case 'crown':
          tile.crown = true;
          tile.empty = false;
          this.boardInventory.crowns++;
          items.splice(items.indexOf('crown'),1)
          break
        case 'buddha':
          tile.crown = true;
          tile.empty = false;
          this.boardInventory.buddhas++;
          if (this.boardInventory.buddhas > 2) items.splice(items.indexOf('buddha'),1)
          break
        case 'lantern':
          tile.lantern = true;
          tile.empty = false;
          this.boardInventory.lanterns++;
          if (this.boardInventory.lanterns > 1) items.splice(items.indexOf('lantern'),1)
          break
        case 'monster':
          tile.monster = true;
          tile.empty = false;
          this.boardInventory.monsters++;
          if (this.boardInventory.monsters > 4) items.splice(items.indexOf('monster'),1)
          break
        case 'disguise':
          tile.disguise = true;
          tile.empty = false;
          this.boardInventory.disguises++;
          if (this.boardInventory.disguises > 0) items.splice(items.indexOf('disguise'),1)
          break
        case 'stairs':
          tile.stairs = true;
          tile.empty = false;
          this.boardInventory.stairs++;
          if (this.boardInventory.stairs > 0) items.splice(items.indexOf('stairs'),1)
          break
        case 'door':
          tile.door = true;
          tile.empty = false;
          this.boardInventory.doors++;
          if (this.boardInventory.doors > 1) items.splice(items.indexOf('door'),1)
        break
        case 'key':
          tile.key = true;
          tile.empty = false;
          this.boardInventory.keys++;
          if (this.boardInventory.keys > 0) items.splice(items.indexOf('key'),1)
        break
        case 'cloud':
          tile.cloud = true;
          tile.empty = false;
          this.boardInventory.clouds++;
          if (this.boardInventory.clouds > 0) items.splice(items.indexOf('cloud'),1)
        break
        case 'skull':
          tile.skull = true;
          tile.empty = false;
          this.boardInventory.skulls++;
          if (this.boardInventory.skulls > 0) items.splice(items.indexOf('skull'),1)
        break
        case 'stairs':
          tile.stairs = true;
          tile.empty = false;
          this.boardInventory.stairs++;
          if (this.boardInventory.stairs > 0) items.splice(items.indexOf('stairs'),1)
        break
        case 'default': 
        break
      }
      this.tiles.push(tile)
      this.idCount++
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
    })
    this.playerManager.newPlayer()

    const crownAbsent = false;
    // for(let tile in this.tiles){
    //   if(this.tiles[tile].class === 'crown'){
    //     return
    //   } else {
    //     crownAbsent = true;
    //   }
    // }
    // if()
  }
  // @HostListener('window:keydown', ['$event'])
  // keyEvent(event: KeyboardEvent) { 
  //   console.log('ksfgsdfgsdfg',event.key);
    
  // }
  onEnterKey($event){
    console.log('WAYOOO, event is ', $event);
    
  }
  isEmpty(target){
    console.log('empty: ',target.empty);
  }
  isId(target){
    console.log('id: ',target.id);
  }
  //catalogue all the empty tiles, push to an array, then randomly choose an index of the array to place player
  
}
