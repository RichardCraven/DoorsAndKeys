import { Component, Input, OnInit } from '@angular/core';
import {PlayerManagerService} from '../services/player-manager.service'
import { Subscription, Observable, interval, timer } from 'rxjs';
import { timeout } from 'q';
import { TryCatchStmt } from '@angular/compiler';

@Component({
  selector: 'combat-board',
  templateUrl: './combat-board.component.html',
  styleUrls: ['./combat-board.component.css']
})
export class CombatBoardComponent implements OnInit {
  topTilesCount = 10;
  botTilesCount = 10;
  gridTilesCount = 80;
  topTiles = [];
  botTiles = [];
  gridTiles = [];
  monsterAttackOrigins = [];
  windowOpen = false;
  playerLocked = false;
  inventory;
  weapon;
  monsterWeapon;
  weaponCount;
  weaponDamage;
  hideMonsterTimer;
  monsterAttackTimer;
  showTimer;
  monsterEndpoint;
  playerEndpoint;
  @Input()monster

  constructor(public playerManager: PlayerManagerService) {
    
  }

  ngOnInit() {
    console.log('initting combat board');
    this.playerManager.initiateCombat()

    window.addEventListener('keydown', (event) => {
      switch(event.key){
        case 'ArrowLeft':
          this.movePlayer('left')
        break
        case 'ArrowRight':
          this.movePlayer('right')
        break
      }
    });
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
    for(let y = 50; y <= 79; y++){
      const tile = this.gridTiles[y]
      tile.placementZone = tile.visible = true;
    }
    for(let q = 0; q <= 29; q++){
      const tile = this.gridTiles[q]
      tile.monsterZone = true;
    }

    this.topTiles[4][this.monster] = true;
    this.topTiles[4].visible = true;
    this.botTiles[5].visible = true;
    this.botTiles[5].occupied = true;
    this.playerEndpoint = 5;

    // this.monsterAttackTimer = timer(6500)
    this.hideMonster()
    
    const initialOpenWindow = timer(1000)
    initialOpenWindow.subscribe(e => {
      this.openWindow();
    })
    
    // this.monsterAttackTimer.subscribe(e => {
    //   this.monsterAttack();
    // })
    this.inventory = this.playerManager.activePlayer.inventory;
    this.weapon = this.inventory.weapon.type;
    // this.weaponCount = this.inventory.weapon.attack;
    this.weaponDamage = this.inventory.weapon.damage;
    this.monsterWeapon = 'down';
  }
  clickTile(tile){
    console.log(tile);
    
    if(tile.placementZone && this.weaponCount && !tile[this.weapon]){
      tile.visible = true;
      tile[this.weapon] = true;
      this.weaponCount--
    }
  }
  openWindow(){
    this.hideMonster();
    this.weaponCount = this.inventory.weapon.attack;
    let that = this;
      var elem = document.getElementById("myBar"); 
      var width = 1;
      var id = setInterval(frame, 50);
      function frame() {
        if (width >= 100) {
          clearInterval(id);
          that.closeWindow()
          that.monsterAttack();
        } else {
          width++; 
          elem.style.width = width + '%'; 
        }
      }
  }
  closeWindow(){
    for(let g in this.gridTiles){
      if(this.gridTiles[g][this.weapon]){
        this.fireWeapon(this.gridTiles[g])
      }
    }
    this.revealMonster()

    if(!this.playerLocked){
      const refreshWindow = timer(3000);
      refreshWindow.subscribe(res => {
        this.openWindow();
      })
    }
  }

  hideMonster(){
    console.log('IN HIDE MONSTER');
    this.hideMonsterTimer = timer(200)
    this.hideMonsterTimer.subscribe(e => {
      for(let tile of this.topTiles){
        if(tile){
          tile[this.monster] = false;
          tile.visible = false;
        } 
      }
    })
  }

  revealMonster(){
    // console.log('revealing monster');
    
    const num = Math.floor(Math.random() * this.topTiles.length)
    const tile = this.topTiles[num];
    tile[this.monster] = tile.visible = true;
    this.monsterEndpoint = num;
  }

  fireWeapon(tile){
    console.log('TILE IS ', tile);
    
    const that = this;
    const id = tile.id
    const tiles = this.gridTiles;
    tile[this.weapon] = false;
    tiles[id -10][this.weapon] = true;

    const launch = setInterval(travel, 100);
    let counter = 10;
    let final = null;
    function travel() {
      tile[that.weapon] = false;
      
      if (counter >= 80) {
        that.checkContact(tiles[id - (counter - 10)]);
        clearInterval(launch);
      } else {
        const newTileId = id-counter;
        
        if(tiles[newTileId]){
          tiles[newTileId].visible = true
          tiles[newTileId][that.weapon] = true
          tiles[newTileId].monsterZone = false;

          // handle previous tile
          const oldTileId = id - (counter - 10)
          if(tiles[oldTileId]){
            tiles[oldTileId][that.weapon] = false;
            tiles[oldTileId].visible = false;
            if(oldTileId <= 29){
              tiles[oldTileId].monsterZone = true;
            }
          }
          
        } else {
          //if newTile is at the last row, process checkContact
            that.checkContact(tiles[id - (counter - 10)]);
        }
        counter += 10
      }
    }
  }
  fireMonsterWeapon(tile){
    // console.log('firing tile ', tile);
    
    const id = tile.id;
    const tiles = this.gridTiles;
    tile[this.monsterWeapon] = false;
    const that = this;
    const launch = setInterval(travel, 100);
    let counter = 10;
    let final = null;
    function travel() {
      // tile[that.weapon] = false;
      if (counter >= 80) {
        that.checkMonsterHit(tiles[final]);
        // console.log('STRIKED at ', tiles[final]);
        
        clearInterval(launch);
      } else {
        const newTileId = id+counter;
        if(tiles[newTileId]){
          tiles[newTileId].visible = tiles[newTileId][that.monsterWeapon] = true;
          tiles[newTileId].monsterZone = false;

          // tiles[newTileId].placementZone = false;
          final = newTileId;
          const oldTileId = id + (counter - 10)
          if(tiles[oldTileId] ){
            tiles[oldTileId][that.monsterWeapon] = false;
            tiles[oldTileId].visible = false;
            if(oldTileId <= 29){
              tiles[oldTileId].monsterZone = true;
            }
          } 
        } else {
          //if newTile is at the last row, process checkContact
            that.checkMonsterHit(tiles[id + (counter - 10)]);
        }
        counter += 10
      }
    }
  }
  monsterAttack(){
    console.log('monster attacking!');
    let attacks = 3; //to be replaced with monster attack from json
    const tiles = this.gridTiles;
    
    //NEED TO ACCOUNT FOR STACKING OF ATTACKS
    //PROBABLY BY ASSIGNING A 'STACKED' PROPERTY TO PAIRS OF STACKS
    while(attacks > 0){
      let num = Math.floor(Math.random()* 30)
      if(this.monsterAttackOrigins.indexOf(num) < 0){
        this.monsterAttackOrigins.push(num)
        let tile = tiles[num];
        tile[this.monsterWeapon] = true;
        this.fireMonsterWeapon(tile);
        attacks--
      }
    }
  }

  checkContact(tile){
    // console.log('CHECK, for tile');
    if (!tile) return
    if(tile.id === this.monsterEndpoint) this.monsterHit();
      else this.monsterMiss(tile)
  }
  checkMonsterHit(tile){
    if (!tile) return
    // console.log('in check monster hit');
    // console.log(tile.id % 10, this.playerEndpoint);
    
    if(tile.id % 10 === this.playerEndpoint) this.playerHit()
      else this.playerMiss(tile);
  }

  monsterHit(){
    const that = this;
    const flashInterval = setInterval(flash, 100)
    let counter = 0;
    function flash(){
      if(counter < 7){
        that.topTiles[that.monsterEndpoint].flash = !that.topTiles[that.monsterEndpoint].flash
      } else {
        clearInterval(flashInterval)
      }
      counter++
    }
  }
  monsterMiss(tile){
    tile.visible = tile[this.weapon] = false;
    tile.monsterZone = true;
    const monsterRowTile = this.topTiles[tile.id];
    if(monsterRowTile) monsterRowTile[this.weapon] = monsterRowTile.visible = monsterRowTile.slowFade = true;
    const fadeTimer = timer(750)
    const that = this;
    fadeTimer.subscribe(e => {
      monsterRowTile[that.weapon] = monsterRowTile.visible = false;
      
    })
  }
  playerHit(){
    console.log('player hit! about to flash');
    this.playerLocked = true;
    const that = this;
    const flashInterval = setInterval(flash, 100)
    let counter = 0;
    function flash(){
      console.log('flash');
      
      if(counter < 7){
        that.botTiles[that.playerEndpoint].flash = !that.botTiles[that.playerEndpoint].flash
      } else {
        that.playerLocked = false;
        clearInterval(flashInterval)

        const refreshWindow = timer(3000);
        refreshWindow.subscribe(res => {
        that.openWindow();
        })
      }
      counter++
    }
  }
  playerMiss(tile){
    //this is for the monster missing the player
    tile.visible = tile[this.monsterWeapon] = false;
    tile.placementZone = true;

    const playerRowTile = this.botTiles[tile.id%10];
    if(playerRowTile) playerRowTile[this.monsterWeapon] = playerRowTile.visible = playerRowTile.slowFade = true;
    const fadeTimer = timer(750)
    const that = this;
    fadeTimer.subscribe(e => {
      playerRowTile[that.monsterWeapon] = playerRowTile.visible = false;
      
    })
  }
  movePlayer(direction){
    if(this.playerLocked) return
    const tiles = this.botTiles;
    let endPoint = this.playerEndpoint;

    switch (direction){
      case 'left':
        console.log('left');
        if(tiles[endPoint - 1]){
          tiles[endPoint].occupied = tiles[endPoint].visible = false;
          tiles[endPoint - 1].occupied = tiles[endPoint - 1].visible = true;
          this.playerEndpoint = this.playerEndpoint - 1
        } 
      break
      case 'right':
      console.log('right');
      if(tiles[endPoint + 1]){
        tiles[endPoint].occupied = tiles[endPoint].visible = false;
        tiles[endPoint + 1].occupied = tiles[endPoint + 1].visible = true;
        this.playerEndpoint = this.playerEndpoint + 1
      } 
      break
    }
    // if(!this.currentMap[this.activePlayer.location].contains){
    //   const visible = this.checkVisibility(this.activePlayer.location, this.activePlayer.visibility)
    //   this.subject.next({location: this.activePlayer.location, old_location : old_location.id, visibility: visible});
    // }     
  }
}
