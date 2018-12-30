import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import {PlayerManagerService} from '../services/player-manager.service'
import {ItemsService} from '../services/items.service'
import { Subscription, Observable, Subject, interval, timer, of, from } from 'rxjs';
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
  selector: 'combat-board',
  templateUrl: './combat-board.component.html',
  styleUrls: ['./combat-board.component.css']
})
export class CombatBoardComponent implements OnInit {
  subject = new Subject<any>();
  delayed2000 = new Subject<any>();
  delayed1000 = new Subject<any>();
  delayed750 = new Subject<any>();
  delayed500 = new Subject<any>();
  topTilesCount = 10;
  botTilesCount = 10;
  gridTilesCount = 80;
  round = 0;
  differential = 0;
  monsterDefeated;
  monsterInfoLine1;
  monsterInfoLine2;
  playerInfo;
  topTiles = [];
  botTiles = [];
  gridTiles = [];
  roundNumTiles = [];
  numbers = ['zero','one','two','three','four','five','six','seven','eight','nine',];
  monsterAttackOrigins = [];
  monsterHealthInitial = 0;
  monsterHealth = 0;
  playerHealth = 100;
  playerHealthInitial = 100;
  windowOpen = false;
  playerLocked = false;
  showBar = true;
  sub1;
  sub2;
  sub3;
  sub4;
  playerInventoryTiles = [];
  weapon;
  monsterWeapon;
  monsterIcon = {};
  monsterMovementZoneStartpoint;
  monsterMovementZoneEndpoint;
  monsterMovementLeftEnd;
  monsterMovementRightEnd;
  monsterMovementMiddle;
  weaponCount;
  weaponDamage;
  initialOpenWindow;
  monsterAttackTimer;
  showTimer;
  fadeTimer;
  monsterEndpoint;
  playerPosition;
  monsterBar;
  playerBar;
  spellCasting = false;
  @Input()monster

  constructor(public playerManager: PlayerManagerService, public itemsService: ItemsService) { 

  }

  ngOnInit() {
    const inventory = this.playerManager.activePlayer.inventory;
    
    
    for(let i = 0; i < inventory.weapons.length; i++){
      let tile = {};
      tile[inventory.weapons[i].type] = true;
      this.playerInventoryTiles.push(tile)
    }
    for(let w = 0; w < inventory.wands.length; w++){
      let tile = {};
      tile[inventory.wands[w].type] = true;
      this.playerInventoryTiles.push(tile)
    }
    for(let s = 0; s < inventory.shields.length; s++){
      let tile = {};
      tile[inventory.shields[s].type] = true;
      this.playerInventoryTiles.push(tile)
    }
    for(let h = 0; h < inventory.headgear.length; h++){
      let tile = {};
      tile[inventory.headgear[h].type] = true;
      this.playerInventoryTiles.push(tile)
    }
    for(let c = 0; c < inventory.charms.length; c++){
      let tile = {};
      tile[inventory.charms[c].type] = true;
      this.playerInventoryTiles.push(tile)
    };
    this.monsterHealthInitial = this.monster.health;
    this.monsterHealth = this.monster.health;

    this.monsterBar = document.getElementById("monster-health-bar");
    this.monsterBar.style.height = 0+'%'

    this.monsterInfoLine1 = this.monster.combatMessages.greeting
    this.playerManager.initiateCombat()

    window.addEventListener('keydown', (event) => {
      switch(event.key){
        case 'ArrowLeft':
          this.movePlayer('left')
        break
        case 'ArrowRight':
          this.movePlayer('right')
        break
        case ' ':
          this.addAttack()
        break
        case 'Meta':
          console.log('casting spell');
          this.spellCasting = true;
        break
      }
    });

    window.addEventListener('keyup', (event) => {
      switch(event.key){
        case 'Meta':
          console.log('releasing spell');
          this.spellCasting = false;
        break
      }
    })    
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
      tile.placementZone = true;
      tile.visible = false;
    }
    for(let q = 0; q <= 29; q++){
      const tile = this.gridTiles[q]
      tile.monsterZone = true;
    }

    for(let q = 0; q < 2; q++){
      let tile = {}
      this.roundNumTiles.push(tile)
    }
    
    this.topTiles[4][this.monster.type] = true;
    this.topTiles[4].visible = true;
    this.monsterEndpoint = 4;
    this.botTiles[5].visible = true;
    this.botTiles[5].occupied = true;
    this.playerPosition = 5;

    this.monsterIcon[this.monster.type] = true
    
    this.weapon = this.playerManager.activePlayer.inventory.weapons[0];

    this.weaponCount = this.weapon.attack;
    this.weaponDamage = this.weapon.damage;
    this.monsterWeapon = 'down';

    const max = this.topTiles.length
    this.monsterMovementZoneStartpoint = this.monsterEndpoint - this.monster.agility >= 0 ? this.monsterEndpoint - this.monster.agility : 0
    this.monsterMovementZoneEndpoint = this.monsterEndpoint + this.monster.agility <= max ? this.monsterEndpoint + this.monster.agility : max

    //subscribe

    this.sub1 = this.getDelayed2000().subscribe( res => {
      this.functionRouter(res);
    })
    
    this.sub2 = this.getDelayed1000().subscribe( res => {
      this.functionRouter(res);
    })
    this.sub3 = this.getDelayed750().subscribe( res => {
      if(typeof res !== 'string'){
        res[this.weapon.type] = res.visible = false;
      } else {
        this.functionRouter(res);
      }
    })
    this.sub4 = this.getDelayed500().subscribe( res => {
      this.functionRouter(res);
    })

    this.delayed1000.next('openWindow')
  }
  functionRouter(string){
    switch (string){
      case 'openWindow':
          this.openWindow()
        break

        case 'closeWindow':
          this.closeWindow();
        break

        case 'monsterAttack':
          this.monsterAttack();
        break

        case 'revealBar':
          this.showBar = true;
        break

        case 'closeGate':
          this.closeGate()
        break

        case 'showMovementZone':
          this.showMovementZone()
        break

        case 'endCombat-monsterDead':
        this.playerManager.endCombat('monsterDead');
        break

        case 'endCombat-playerDead':
        this.playerManager.endCombat('playerDead');
        break
    }
  }
  clickTile(tile){
    console.log(tile);
    
    if(tile.placementZone && this.weaponCount && !tile[this.weapon.type] && !this.playerLocked){
      tile.visible = true;
      tile[this.weapon.type] = true;
      this.weaponCount--
    }
  }
  clearMonsterRows(){
    for(let t in this.topTiles){
      this.topTiles[t].flash = false;
    }
    for(let o = 0; o < 30; o++){
      this.gridTiles[o].monsterZone = true;
    }
  }
  clearPlayerRows(){
    for(let t in this.botTiles){
      this.botTiles[t][this.monsterWeapon] = false;
    }
  }
  clearGridRows(){
    for(let t in this.gridTiles){
      this.gridTiles[t][this.monsterWeapon] = this.gridTiles[t][this.weapon.type] = this.gridTiles[t].visible = false;
    }
  }
  openWindow(){
    // this.playerManager.globalSubject.next('hi')
    if(this.monsterDefeated) return
    this.playerLocked = false;
    this.monsterInfoLine1 = this.monsterInfoLine2 = this.playerInfo = '';
    this.showBar = true;
    
    const tiles = this.roundNumTiles;
    const round = this.round;
    const first = tiles[0]
    const second = tiles[1]

    for(let i = 0; i < this.numbers.length; i++){
      first[this.numbers[i]] = false;
      second[this.numbers[i]] = false;
    }
    
    if(round < 10){
      tiles[0][this.numbers[round]] = true;
      if(round > 0 && tiles[0][this.numbers[round -1]]){
        tiles[0][this.numbers[round -1]] = false;
      }
    }
    if(round === 10) {
      if(round > 0 && tiles[0][this.numbers[round -1]]){
        tiles[0][this.numbers[round -1]] = false;
      }
      tiles[0].one = true;
      tiles[1].zero = true;
    }
    if(round > 10) {
      tiles[0][this.numbers[Math.floor(round/10)]] = true;
      tiles[1][this.numbers[round%10]] = true;
    }

    this.hideMonster();
    this.clearMonsterRows();
    this.clearPlayerRows();
    this.clearGridRows();
    
    
    this.weaponCount = this.weapon.attack;
    this.openGate();
    return 'openWindow'
  }
  openGate(){
    
    let that = this;
    var elem = document.getElementById("myBar"); 
      var width = 1;
      var id = setInterval(frame, 25);
      function frame() {
        if (width >= 100) {
          clearInterval(id);
          that.revealMonster();
          that.playerLocked = true;
          that.delayed500.next('closeWindow')
          that.delayed500.next('monsterAttack')
        } else {
          width++; 
          elem.style.width = width + '%'; 
        }
      }
  }
  closeGate(){
    let that = this;
      var elem = document.getElementById("myBar"); 
      var width = 100;
      var id = setInterval(frame, 10);
      function frame() {
        if (width === 0) {
          clearInterval(id);
        } else {
          width--; 
          elem.style.width = width + '%'; 
        }
      }
  }
  closeWindow(){
    this.round++
    this.showBar = false;
    for(let g in this.gridTiles){
      if(this.gridTiles[g][this.weapon.type]){
        this.fireWeapon(this.gridTiles[g])
      }
    }
    this.delayed500.next('revealBar')
    this.delayed750.next('showMovementZone')
    this.delayed750.next('closeGate')
    this.delayed2000.next('openWindow')
    return 'closeWindow'
  }

  hideMonster(){
    for(let tile of this.topTiles){
      if(tile){
        tile[this.monster.type] = tile.visible = tile.monsterMovementLeftEnd = tile.monsterMovementMiddle = tile.monsterMovementRightEnd = false;
      } 
    }
  }

  revealMonster(){
    let options = [];
    if(this.monsterEndpoint < 5){
      for(let i = this.monsterEndpoint; i<=(this.monsterEndpoint+this.monster.agility); i++){
        options.push(i)
      }
    } else {
      for(let i = this.monsterEndpoint; i>=(this.monsterEndpoint-this.monster.agility); i--){
        options.push(i)
      }
    }
    
    let num = Math.floor(Math.random() * options.length)
    let index = options[num]

    if (index === this.monsterEndpoint){
      num = Math.floor(Math.random() * options.length)
      index = options[num]
    }
    if (index > 9) index = 9;
    if (index < 0 ) index = 0

    let tile = this.topTiles[index];
    tile[this.monster.type] = tile.visible = true;
    this.monsterEndpoint = index;
  }

  showMovementZone(){
    const max = this.topTiles.length
    this.monsterMovementZoneStartpoint = (this.monsterEndpoint - this.monster.agility) >= 0 ? (this.monsterEndpoint - this.monster.agility) : 0
    // this.monsterMovementZoneStartpoint = this.monsterEndpoint - this.monster.agility
    this.monsterMovementZoneEndpoint = (this.monsterEndpoint + this.monster.agility) <= max ? (this.monsterEndpoint + this.monster.agility) : max
    // this.monsterMovementZoneEndpoint = this.monsterEndpoint + this.monster.agility
    if(this.monsterMovementZoneStartpoint === 10){
      console.log('ERROR!! monster movement zone start point is 10');
      
    }
    if(this.monsterMovementZoneEndpoint === 10){
      console.log('ERROR!! monster movement zone end point is 10');
      
    }


    for(let i = this.monsterMovementZoneStartpoint; i <= this.monsterMovementZoneEndpoint; i++){
      if(!this.topTiles[i]){
        console.log('ERROR! tile is undefined. i is ', i);
        continue
      }
      if(i === this.monsterMovementZoneStartpoint){
        this.topTiles[i].monsterMovementLeftEnd = true;
      } else if(i === this.monsterMovementZoneEndpoint){
        this.topTiles[i].monsterMovementRightEnd = true;
      }else{
        this.topTiles[i].monsterMovementMiddle = true;
      }
    }
  }

  fireWeapon(tile){
    const that = this;
    const id = tile.id
    const tiles = this.gridTiles;
    tile[this.weapon.type] = false;

    //need to handle monster being hit so this part doesn't break
    if(!tiles[id -10]) return
    tiles[id -10][this.weapon.type] = true;

    const launch = setInterval(travel, 80);
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
          tiles[newTileId][that.weapon.type] = true
          tiles[newTileId].monsterZone = false;

          // handle previous tile
          const oldTileId = id - (counter - 10)
          if(tiles[oldTileId]){
            // console.log('here: ', tiles[oldTileId]);
            
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
    const id = tile.id;
    const tiles = this.gridTiles;
    tile[this.monsterWeapon] = false;
    const that = this;
    const launch = setInterval(travel, 80);
    let counter = 10;
    let final = null;
    function travel() {
      // tile[that.weapon] = false;
      if (counter >= 80) {
        that.checkMonsterHit(tiles[final]);
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
    this.monsterAttackOrigins = [];
    let attacks = this.monster.attack; //to be replaced with monster attack from json
    const tiles = this.gridTiles;

    this.monsterInfoLine1 = this.monster.combatMessages.attack[Math.floor(Math.random()*this.monster.combatMessages.attack.length)]
    
    //NEED TO ACCOUNT FOR STACKING OF ATTACKS
    //PROBABLY BY ASSIGNING A 'STACKED' PROPERTY TO PAIRS OF STACKS
    while(attacks > 0){
      let num = Math.floor(Math.random()* 30)
      if(this.monsterAttackOrigins.indexOf(num) < 0){
        attacks--
        this.monsterAttackOrigins.push(num)
        let tile = tiles[num];
        tile[this.monsterWeapon] = true;
        this.fireMonsterWeapon(tile);
      }
    }
  }
  addAttack(){
    if(!this.weaponCount || this.playerLocked) return
    
    if(!this.gridTiles[this.playerPosition + 70][this.weapon.type]){
      this.gridTiles[this.playerPosition + 70][this.weapon.type] = this.gridTiles[this.playerPosition + 70].visible = true;
      this.weaponCount --
    } else if(!this.gridTiles[this.playerPosition + 60][this.weapon.type]){
      this.gridTiles[this.playerPosition + 60][this.weapon.type] = this.gridTiles[this.playerPosition + 60].visible = true;
      this.weaponCount --
    } else if(!this.gridTiles[this.playerPosition + 50][this.weapon.type]){
      this.gridTiles[this.playerPosition + 50][this.weapon.type] = this.gridTiles[this.playerPosition + 50].visible = true;
      this.weaponCount --
    }
  }
  checkContact(tile){
    if (!tile) return
    if(tile.id === this.monsterEndpoint) this.monsterHit();
      else this.monsterMiss(tile)
  }
  checkMonsterHit(tile){
    if (!tile) return
    if(tile.id % 10 === this.playerPosition) this.playerHit()
      else this.playerMiss(tile);
  }

  monsterHit(){
    const that = this;
    const damage = this.weaponDamage;
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
    this.monsterHealth -= damage;
    this.playerInfo = 'You hit for ' + damage + ' damage!'

    this.monsterBar = document.getElementById("monster-health-bar");
    const percentage = (100 - (this.monsterHealth / this.monsterHealthInitial * 100))
    this.monsterBar.style.height = percentage+'%'
    if(this.monsterHealth < 1){
      console.log('monster dead!!!!');
      this.monsterDefeated = true;
      this.delayed2000.next('endCombat-monsterDead')
    }
  }
  monsterMiss(tile){
    tile.visible = tile[this.weapon.type] = false;
    tile.monsterZone = true;
    const monsterRowTile = this.topTiles[tile.id];
    if(monsterRowTile) monsterRowTile[this.weapon.type] = monsterRowTile.visible = monsterRowTile.slowFade = true;
    this.delayed750.next(monsterRowTile)
  }
  playerHit(){
    this.playerLocked = true;
    const that = this;
    const flashInterval = setInterval(flash, 100)
    let counter = 0;
    function flash(){
      
      if(counter < 10){
        that.botTiles[that.playerPosition].flash = !that.botTiles[that.playerPosition].flash
      } else {
        that.handlePlayerHit();
        clearInterval(flashInterval)
      }
      counter++
    }
    this.playerHealth -= this.monster.damage;
    this.playerInfo = 'Hit you for ' + this.monster.damage + ' damage!'
    this.playerBar = document.getElementById("player-health-bar");
    const percentage = (100 - (this.playerHealth / this.playerHealthInitial * 100))
    this.playerBar.style.height = percentage+'%'
    if(this.playerHealth < 1){
      console.log('player dead!!!!');
      this.delayed2000.next('endCombat-playerDead')
    }
  }
  handlePlayerHit(){
    //check hit points


    //survived?
    for(let t in this.botTiles){
      this.botTiles[t].flash = false;
    }
    // this.botTiles[this.playerPosition].flash = false;
    for(let y = 50; y <= 79; y++){
      const tile = this.gridTiles[y]
      if(tile[this.monsterWeapon]) tile[this.monsterWeapon] = null;
      tile.placementZone = true;
      tile.visible = false;
    }
    this.playerLocked = false;
  }
  playerMiss(tile){
    //this is for the monster missing the player
    tile.visible = tile[this.monsterWeapon] = false;
    tile.placementZone = true;

    const playerRowTile = this.botTiles[tile.id%10];
    if(playerRowTile) playerRowTile[this.monsterWeapon] = playerRowTile.visible = playerRowTile.slowFade = true;
    this.delayed750.next(playerRowTile)
    // const fadeTimer = timer(750)
    // const that = this;
    // this.sub1 = fadeTimer.subscribe(e => {
    //   this.fade(playerRowTile)
    // })
  }
  fade(tile){
    tile[this.monsterWeapon] = tile.visible = false;
    
    this.sub1.unsubscribe()
  }
  movePlayer(direction){
    if(this.playerLocked) return
    const tiles = this.botTiles;
    let endPoint = this.playerPosition;

    switch (direction){
      case 'left':
        if(tiles[endPoint - 1] && !tiles[endPoint-1][this.monsterWeapon]){
          tiles[endPoint].occupied = tiles[endPoint].visible = false;
          tiles[endPoint - 1].occupied = tiles[endPoint - 1].visible = true;
          this.playerPosition = this.playerPosition - 1
        } 
      break
      case 'right':
      if(tiles[endPoint + 1] && !tiles[endPoint+1][this.monsterWeapon]){
        tiles[endPoint].occupied = tiles[endPoint].visible = false;
        tiles[endPoint + 1].occupied = tiles[endPoint + 1].visible = true;
        this.playerPosition = this.playerPosition + 1
      } 
      break
    }
  }


  //OBSERVABLES

  

  // Observable<any>]
  // getDelayedThing(): Observable<any>{
  //   return of('delayed?').pipe(
  //     mapTo('world'),
  //     delay(1000)
  //   )
  // }
  getDelayed2000(): Observable<any>{
    return this.delayed2000.pipe(
      delay(2000)
    )
  }
  getDelayed1000(): Observable<any>{
    return this.delayed1000.pipe(
      delay(1000)
    )
  }
  getDelayed750(): Observable<any>{
    return this.delayed750.pipe(
      delay(750)
    )
  }
  getDelayed500(): Observable<any>{
    return this.delayed500.pipe(
      delay(500)
    )
  }

  // takeWhileObservable

  setThing(){
    this.subject.next('dood');
  }

  ngOnDestroy(): void {
    console.log('calling UNSUBSCRIBE');
    
    this.sub1.unsubscribe();
    this.sub2.unsubscribe();
    this.sub3.unsubscribe();
    this.sub4.unsubscribe();
  
  }
}
