import { Component, OnInit } from '@angular/core';
import { Subscription, Observable, Subject } from 'rxjs';
import { PlayerManagerService } from '../services/player-manager.service';

@Component({
  selector: 'inventoryPanel',
  templateUrl: './inventory-panel.component.html',
  styleUrls: ['./inventory-panel.component.css']
})
export class InventoryPanelComponent implements OnInit {

  constructor(public playerManager: PlayerManagerService) { 
    this.playerManager.getGlobalMessages().subscribe(res => {
      console.log('zoiom');
      if(res.update){
        this.updateInventory()
      }
    })
  }
  tiles = [];
  itemSubscription: Subscription;
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
    this.updateInventory();
  }
  updateInventory(){
    const inventory = this.playerManager.activePlayer.inventory;
    this.tiles = [];
    for(let i in inventory.weapons){
      let weapon = inventory.weapons[i].type
      let tile = {}
      tile[weapon] = true;
      this.tiles.push(tile)
    }
    for(let i in inventory.charms){
      let charm = inventory.charms[i].type
      let tile = {}
      tile[charm] = true;
      this.tiles.push(tile)
    }
    for(let i in inventory.amulets){
      let amulet = inventory.amulets[i].type
      let tile = {}
      tile[amulet] = true;
      this.tiles.push(tile)
    }
    for(let i in inventory.headgear){
      let headgear = inventory.headgear[i].type
      let tile = {}
      tile[headgear] = true;
      this.tiles.push(tile)
    }
    for(let i in inventory.misc){
      let item = inventory.misc[i].type
      let tile = {}
      tile[item] = true;
      this.tiles.push(tile)
    }
  }

}
