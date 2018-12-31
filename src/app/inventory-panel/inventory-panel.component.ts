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
import { ItemsService } from '../services/items.service';

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
        this.combatStarted = true;
        this.updateInventory();
        this.startCombat()
      }
    })
    this.playerManager.getAttackNotification().subscribe(res => {
      // console.log('res is ', res);
      if(res.weapon){
        this.attackWith(res.weapon.type)
      }
      if(res.wand){
      console.log('RES WAND');
      
        this.castWith(res.wand.type)
      }
    })
  }
  delayed500 = new Subject<any>();
  delayed3000 = new Subject<any>();
  delayed6000 = new Subject<any>();
  tiles = [];
  row1 = [];
  row2 = [];
  row3 = [];
  counter = 0;
  sub1: Subscription;
  sub2: Subscription;
  sub3: Subscription;
  combatStarted = false;
  ngOnInit() {
    this.sub1 = this.getDelayed500().subscribe( res => {
      if(typeof res === 'string'){
        this.functionRouter(res);
        return
      }
      console.log('tile is ', res.tile);
      
      const tile = res.tile
      tile.begin = true;
      if(tile.weapon){
        this.delayed3000.next({tile})
      }
      if(tile.wand){
        this.delayed6000.next({tile})
      }
    })
    this.sub2 = this.getDelayed3000().subscribe( res => {
      const tile = res.tile
      tile.available = true;
    })
    this.sub3 = this.getDelayed6000().subscribe( res => {
      console.log('calling 6000');
      const tile = res.tile
      tile.available = true;
      
      if(typeof res === 'string'){
        this.functionRouter(res);
        return
      }
      // this.delayed3000.next({tile})
    })

    this.updateInventory();

    this.startCombat();
    // this.beginTimers();
  }
  functionRouter(functionName : string){
    switch (functionName){
      case 'wandBlast':
      console.log('wand blast');
      
      break
    }
  }
  updateInventory(){
    this.counter = 0;
    const inventory = this.playerManager.activePlayer.inventory;
    this.tiles = [];
    this.row1 = [];
    this.row2 = [];
    this.row3 = [];
    for(let i in inventory.weapons){
      let weapon = inventory.weapons[i].type
      let attack = inventory.weapons[i].attack
      let tile = {}
      tile['id'] = this.counter;
      this.counter++
      tile[weapon] = tile['inventory'] = tile['weapon'] = tile['available'] = true;
      this.tiles.push(tile)
      if(this.combatStarted){
        for(let j = 1; j < attack; j++){
          let tile = {}
          tile['id'] = this.counter;
          this.counter++
          tile[weapon] = tile['inventory'] = tile['weapon'] = tile['available'] = true;
          this['row'+j].push(tile)
        }
      }
    }
    for(let i in inventory.wands){
      let item = inventory.wands[i].type
      let tile = {}
      tile['id'] = this.counter;
      this.counter++
      tile[item] = tile['inventory'] = tile['wand'] = tile['available'] = true;
      this.tiles.push(tile)
    }
    for(let i in inventory.charms){
      let charm = inventory.charms[i].type
      let tile = {}
      tile['id'] = this.counter;
      this.counter++
      tile[charm] = tile['inventory'] = tile['available'] = true;
      this.tiles.push(tile)
    }
    for(let i in inventory.amulets){
      let amulet = inventory.amulets[i].type
      let tile = {}
      tile['id'] = this.counter;
      this.counter++
      tile[amulet] = tile['inventory'] =  tile['available'] = true;
      this.tiles.push(tile)
    }
    for(let i in inventory.headgear){
      let headgear = inventory.headgear[i].type
      let tile = {}
      tile['id'] = this.counter;
      this.counter++
      tile[headgear] = tile['inventory'] = tile['available'] = true;
      this.tiles.push(tile)
    }
    for(let i in inventory.misc){
      let item = inventory.misc[i].type
      let tile = {}
      tile['id'] = this.counter;
      this.counter++
      tile[item] = tile['inventory'] = tile['available'] = true;
      this.tiles.push(tile)
    }
  }
  click(tile){
    if(tile.weapon){
      this.useItem(tile)
      return
    }
    if(tile.wand){
      this.castItem(tile)
      return
    }
  }
  useItem(tile){
    if(tile.available){
      tile.available = false;
      tile.begin = false;
      this.delayed500.next({tile})
    }
  }
  castItem(tile){
    if(tile.available){
      tile.available = false;
      tile.begin = false;
      console.log('casting ', tile);
      
      this.delayed500.next({tile})
    }
  }
  attackWith(item){
    for(let i in this.tiles){
      let tile = this.tiles[i]
      if(tile[item] && tile.available){
        this.useItem(tile)
        return
      }
    }
    for(let i in this.row1){
      let tile = this.row1[i]
      if(tile[item] && tile.available){
        this.useItem(tile)
        return
      }
    }
    for(let i in this.row2){
      let tile = this.row2[i]
      if(tile[item] && tile.available){
        this.useItem(tile)
        return
      }
    }
  }
  castWith(item){
    let wandTile;
    for(let i in this.tiles){
      if(this.tiles[i].wand){
        wandTile = this.tiles[i]
      }
    }
    for(let i in this.tiles){
      let tile = this.tiles[i]
      
      if(tile[item] && tile.available){
        this.castItem(tile)
        return
      }
    }
  }
  startCombat(){
    //turn on overlays
    for(let i in this.tiles){
      if(this.tiles[i].weapon){
        this.tiles[i].overlay = true;
      }
    }
    for(let i in this.tiles){
      if(this.tiles[i].wand){
        this.tiles[i].overlay = true;
      }
    }
    for(let p in this.row1){
      if(this.row1[p].weapon){
        this.row1[p].overlay = true;
      }
    }
    for(let i in this.row2){
      if(this.row2[i].weapon){
        this.row2[i].overlay = true;
      }
    }
    for(let i in this.row3){ 
      if(this.row3[i].weapon){
        this.row3[i].overlay = true;
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
      delay(100)
    )
  }
  getDelayed3000(): Observable<any>{
    return this.delayed3000.pipe(
      delay(2500)
    )
  }
  getDelayed6000(): Observable<any>{
    return this.delayed6000.pipe(
      delay(5500)
    )
  }
}
