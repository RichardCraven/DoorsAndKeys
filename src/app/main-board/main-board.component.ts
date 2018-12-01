import { Component, OnInit } from '@angular/core';
import {TileComponent} from '../tile/tile.component'

@Component({
  selector: 'main-board',
  templateUrl: './main-board.component.html',
  styleUrls: ['./main-board.component.css']
})
export class MainBoardComponent implements OnInit {
  idCount = 1;
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
  constructor() { }

  ngOnInit() {
    var DOMboard = document.querySelector('.board')
    for (let i = 0; i<81; i++){
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
        name : 'j',
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
        class: ''
      }
      const items = this.items;
      if(items[num] === 'crown') items.splice(num, 1)
      tile.class = tile.contains
      // tile.class = tit
      
      switch(tile.contains){
        case 'crown':
          tile.crown = true;
          this.boardInventory.crowns++;
          items.splice(items.indexOf('crown'),1)
          break
        case 'buddha':
          tile.crown = true;
          this.boardInventory.buddhas++;
          if (this.boardInventory.buddhas > 2) items.splice(items.indexOf('buddha'),1)
          break
        case 'lantern':
          tile.crown = true;
          this.boardInventory.lanterns++;
          if (this.boardInventory.lanterns > 1) items.splice(items.indexOf('lantern'),1)
          break
        case 'monster':
          tile.monster = true;
          this.boardInventory.monsters++;
          if (this.boardInventory.monsters > 4) items.splice(items.indexOf('monster'),1)
          break
        case 'disguise':
          tile.disguise = true;
          this.boardInventory.disguises++;
          if (this.boardInventory.disguises > 0) items.splice(items.indexOf('disguise'),1)
          break
        case 'stairs':
          tile.stairs = true;
          this.boardInventory.stairs++;
          if (this.boardInventory.stairs > 0) items.splice(items.indexOf('stairs'),1)
          break
        case 'door':
          tile.door = true;
          this.boardInventory.doors++;
          if (this.boardInventory.doors > 1) items.splice(items.indexOf('door'),1)
        break
        case 'key':
          tile.key = true;
          this.boardInventory.keys++;
          if (this.boardInventory.keys > 0) items.splice(items.indexOf('key'),1)
        break
        case 'cloud':
          tile.cloud = true;
          this.boardInventory.clouds++;
          if (this.boardInventory.clouds > 0) items.splice(items.indexOf('cloud'),1)
        break
        case 'skull':
          tile.skull = true;
          this.boardInventory.skulls++;
          if (this.boardInventory.skulls > 0) items.splice(items.indexOf('skull'),1)
        break
        case 'stairs':
          tile.stairs = true;
          this.boardInventory.stairs++;
          if (this.boardInventory.stairs > 0) items.splice(items.indexOf('stairs'),1)
        break
        case 'default': 
        break
      }
      // if(tile.contains === '') tile.class = tile.class += ', empty'
      // if(tile.contains === 'crown') tile.crown = true;
      // if(tile.contains === 'disguise') tile.disguise = true;
      // if(tile.contains === 'lantern') tile.lantern = true;
      // if(tile.contains === 'buddha') tile.buddha = true;
      // if(tile.contains === 'key') tile.key = true;
      // if(tile.contains === 'skull') tile.skull = true;
      // if(tile.contains === 'monster') tile.monster = true;
      // if(tile.contains === 'door') tile.door = true;
      
      // tile.id = this.idCount
      // var id = 4
      // var tile = new TileComponent(id);

      this.tiles.push(tile)

      // var tile = document.createElement('div');
      // var random = Math.round(Math.random() * 100) /100;
      // tile.classList.add('tile');
      // tile.classList.add('animated');
      // tile.classList.add('bounceInDown');
      // tile.setAttribute('style','animation-delay:'+random+'s; -moz-animation-delay:'+random+'s; -webkit-animation-delay:'+random+'s;')
      // tile.setAttribute('id', this.idCount.toString()) 

      // DOMboard.appendChild(tile)
      
      this.idCount++
    }
    // console.log(this.tiles);
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

}
