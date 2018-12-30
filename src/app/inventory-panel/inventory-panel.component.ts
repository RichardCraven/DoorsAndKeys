import { Component, OnInit } from '@angular/core';
import { PlayerManagerService } from '../services/player-manager.service';
import { Subscription, Observable, Subject } from 'rxjs';

import {
  delay,
  mapTo,
  takeWhile,
  switchMapTo,
  concatAll,
  count,
  scan,
  withLatestFrom,
  share
} from 'rxjs/operators';

@Component({
  selector: 'inventoryPanel',
  templateUrl: './inventory-panel.component.html',
  styleUrls: ['./inventory-panel.component.css']
})
export class InventoryPanelComponent implements OnInit {

  constructor(public playerManager: PlayerManagerService) { 
    this.playerManager.getGlobalMessages().subscribe(res => {
      if(res.update){
        this.updateInventory()
      }
      if(res.startCombat){
        this.startCombat()
      }
    })
  }
  delayed500 = new Subject<any>();
  tiles = [];
  row1 = [];
  row2 = [];
  row3 = [];
  sub1: Subscription;
  combatStarted = false;
  ngOnInit() {
    // console.log(this.playerManager.activePlayer.inventory);
    // const inventory = this.playerManager.activePlayer.inventory;
    // for(let i in inventory.weapons){
    //   let weapon = inventory.weapons[i].type
    //   let tile = {}
    //   tile[weapon] = true;
    //   this.tiles.push(tile)
    // }
    // for(let i in inventory.charms){
    //   let charm = inventory.charms[i].type
    //   let tile = {}
    //   tile[charm] = true;
    //   this.tiles.push(tile)
    // }
    // for(let i in inventory.amulets){
    //   let amulet = inventory.amulets[i].type
    //   let tile = {}
    //   tile[amulet] = true;
    //   this.tiles.push(tile)
    // }
    // for(let i in inventory.headgear){
    //   let headgear = inventory.headgear[i].type
    //   let tile = {}
    //   tile[headgear] = true;
    //   this.tiles.push(tile)
    // }
    // console.log(this.tiles);


    this.sub1 = this.getDelayed500().subscribe( res => {
      // this.functionRouter(res);
      res.tile.begin = true;
    })

    this.updateInventory();

    // this.startCombat();
    // this.beginTimers();
  }
  updateInventory(){
    const inventory = this.playerManager.activePlayer.inventory;
    this.tiles = [];
    this.row1 = [];
    this.row2 = [];
    this.row3 = [];
    for(let i in inventory.weapons){
      let weapon = inventory.weapons[i].type
      let attack = inventory.weapons[i].attack
      let tile = {}
      tile[weapon] = tile['inventory'] = tile['weapon'] = true;
      this.tiles.push(tile)
      console.log(inventory.weapons);
      for(let j = 1; j < attack; j++){
        console.log('add tile');
        let tile = {}
        tile[weapon] = tile['inventory'] = tile['weapon'] = true;
        let row = 'row'+j
        console.log('i is ', i, typeof j);
        this['row'+j].push(tile)
        
      }
      console.log(this.row1);
      
      
    }
    for(let i in inventory.charms){
      let charm = inventory.charms[i].type
      let tile = {}
      tile[charm] = tile['inventory'] = true;
      this.tiles.push(tile)
    }
    for(let i in inventory.amulets){
      let amulet = inventory.amulets[i].type
      let tile = {}
      tile[amulet] = tile['inventory'] = true;
      this.tiles.push(tile)
    }
    for(let i in inventory.headgear){
      let headgear = inventory.headgear[i].type
      let tile = {}
      tile[headgear] = tile['inventory'] = true;
      this.tiles.push(tile)
    }
    for(let i in inventory.misc){
      let item = inventory.misc[i].type
      let tile = {}
      tile[item] = tile['inventory'] = true;
      this.tiles.push(tile)
    }
  }
  click(tile){
    this.useItem(tile)
    
  }
  useItem(tile){
    tile.begin = false;
    this.delayed500.next({tile})
  }
  startCombat(){
    for(let i in this.tiles){
      if(this.tiles[i].weapon){
        this.tiles[i].overlay = true;
      }
    }
  }
  beginTimers(){
    //for things that don't start charged (wands and such)
    // for(let i in this.tiles){
    //   if(this.tiles[i].weapon){
    //     this.tiles[i].begin = true;
    //   }
    // }
  }
  getDelayed500(): Observable<any>{
    return this.delayed500.pipe(
      delay(1)
    )
  }
}
