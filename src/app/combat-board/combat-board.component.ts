import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import {PlayerManagerService} from '../services/player-manager.service'
import {ItemsService} from '../services/items.service'
import { Subscription, Observable, Subject, interval, timer, of, from } from 'rxjs';
// import { Observable, of, empty, fromEvent, from } from 'rxjs';
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

// import { Observable } from 'rxjs/Observable';
// import { Subscription } from 'rxjs/Subscription';

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
  round = 8;
  topTiles = [];
  botTiles = [];
  gridTiles = [];
  roundNumTiles = [];
  numbers = ['zero','one','two','three','four','five','six','seven','eight','nine',];
  monsterAttackOrigins = [];
  monsterHealthInitial = 0;
  monsterHealth = 0;
  windowOpen = false;
  playerLocked = false;
  showBar = true;
  sub1;
  sub2;
  sub3;
  sub4;
  inventory;
  weapon;
  monsterWeapon;
  monsterIcon = {};
  weaponCount;
  weaponDamage;
  initialOpenWindow;
  hideMonsterTimer;
  monsterAttackTimer;
  showTimer;
  fadeTimer;
  monsterEndpoint;
  playerPosition;
  monsterBar;
  @Input()monster

  constructor(public playerManager: PlayerManagerService, public itemsService: ItemsService) {
    
  }

  ngOnInit() {
    
    //emit 1,2,3,4,5
    // const source = of(1, 2, 3, 4, 5);

    //allow values until value from source is greater than 4, then complete
    // const example = source.pipe(takeWhile(val => val <= 4));

    //output: 1,2,3,4
    // const subscribe = example.subscribe(val => console.log(val));


    // var monsterBar = document.getElementById("monster-health-bar"); 
      this.monsterHealthInitial = this.monster.health;
      this.monsterHealth = this.monster.health;
      
      this.monsterBar = document.getElementById("monster-health-bar");
      this.monsterBar.style.height = 0+'%'


    // console.log('initting combat board');
    this.playerManager.initiateCombat()

    window.addEventListener('keydown', (event) => {
      switch(event.key){
        // case 'ArrowUp':
        //   this.subject.next('up')
        // break
        // case 'ArrowDown':
        // this.delayed1000.next('chickendown')
        // break
        case 'ArrowLeft':
          this.movePlayer('left')
        break
        case 'ArrowRight':
          this.movePlayer('right')
        break
        case ' ':
          this.addAttack()
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
      // tile.monsterZone = true;
    }
    
    this.topTiles[4][this.monster.type] = true;
    this.topTiles[4].visible = true;
    this.botTiles[5].visible = true;
    this.botTiles[5].occupied = true;
    this.playerPosition = 5;

    // this.monsterAttackTimer = timer(6500)
    // this.hideMonster()
    
    
    this.inventory = this.playerManager.activePlayer.inventory;
    this.weapon = this.inventory.weapon.type;
    const itemLibrary = this.itemsService.library;
    this.weaponCount = itemLibrary.weapons[this.weapon].attack;
    this.weaponDamage = itemLibrary.weapons[this.weapon].damage;
    this.monsterWeapon = 'down';

    //subscribe
    this.sub1 = this.getDelayed2000().subscribe( res => {
      switch (res){
        case 'openWindow':
          // console.log('opening window');
          this.openWindow()
        break

        case 'closeWindow':
          // console.log('closing window');
          this.closeWindow();
        break
      }
    })
    
    this.sub2 = this.getDelayed1000().subscribe( res => {
      switch (res){
        case 'openWindow':
          // console.log('opening window');
          this.openWindow()
        break

        case 'closeWindow':
          // console.log('closing window');
          this.closeWindow();
        break
      }
    })
    this.sub3 = this.getDelayed750().subscribe( res => {
      //ONLY TO BE USED FOR FADE OUT
      if(typeof res !== 'string'){
        res[this.weapon] = res.visible = false;
      } else if(res === 'closeGate'){
          this.closeGate()
      }
    })
    this.sub4 = this.getDelayed500().subscribe( res => {
      switch (res){
        case 'openWindow':
          // console.log('opening window');
          this.openWindow()
        break

        case 'closeWindow':
          // console.log('closing window');
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
      }
    })

    this.delayed1000.next('openWindow')
  }
  clickTile(tile){
    console.log(tile);
    
    if(tile.placementZone && this.weaponCount && !tile[this.weapon] && !this.playerLocked){
      console.log('IN HERE');
      
      tile.visible = true;
      tile[this.weapon] = true;
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
      this.gridTiles[t][this.monsterWeapon] = this.gridTiles[t][this.weapon] = this.gridTiles[t].visible = false;
    }
  }
  openWindow(){
    this.playerLocked = false;
    this.monsterIcon[this.monster.type] = true
    
    // console.log('monster bar is ',this.monsterBar);


    console.log('monster health is at: ', this.monsterHealth);
    
    this.showBar = true;
    const tiles = this.roundNumTiles;
    const round = this.round;
    const first = tiles[0]
    const second = tiles[1]

    for(let i = 0; i < this.numbers.length; i++){
      first[this.numbers[i]] = false;
      second[this.numbers[i]] = false;
    }
    console.log('round is ', this.round);
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
    
    
    this.weaponCount = this.inventory.weapon.attack;
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
      if(this.gridTiles[g][this.weapon]){
        this.fireWeapon(this.gridTiles[g])
      }
    }
    // if(!this.playerLocked){
      this.delayed500.next('revealBar')
      this.delayed750.next('closeGate')
      this.delayed2000.next('openWindow')
    // }
    return 'closeWindow'
  }

  hideMonster(){
    for(let tile of this.topTiles){
      if(tile){
        tile[this.monster.type] = false;
        tile.visible = false;
      } 
    }
  }

  revealMonster(){
    const num = Math.floor(Math.random() * this.topTiles.length)
    const tile = this.topTiles[num];
    tile[this.monster.type] = tile.visible = true ;
    this.monsterEndpoint = num;
  }

  fireWeapon(tile){
    const that = this;
    const id = tile.id
    const tiles = this.gridTiles;
    tile[this.weapon] = false;

    //need to handle monster being hit so this part doesn't break
    if(!tiles[id -10]) return
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
    let attacks = 3; //to be replaced with monster attack from json
    const tiles = this.gridTiles;
    
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
    
    if(!this.gridTiles[this.playerPosition + 70][this.weapon]){
      this.gridTiles[this.playerPosition + 70][this.weapon] = this.gridTiles[this.playerPosition + 70].visible = true;
      this.weaponCount --
    } else if(!this.gridTiles[this.playerPosition + 60][this.weapon]){
      this.gridTiles[this.playerPosition + 60][this.weapon] = this.gridTiles[this.playerPosition + 60].visible = true;
      this.weaponCount --
    } else if(!this.gridTiles[this.playerPosition + 50][this.weapon]){
      this.gridTiles[this.playerPosition + 50][this.weapon] = this.gridTiles[this.playerPosition + 50].visible = true;
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
    this.monsterHealth -= 10

    console.log('monster health is now at ', this.monsterHealth);
    console.log('monster health initial was ', this.monsterHealthInitial);
    console.log('percentage is ', (this.monsterHealth / this.monsterHealthInitial *100)+'%');
    
    
    this.monsterBar = document.getElementById("monster-health-bar");
    const percentage = (100 - (this.monsterHealth / this.monsterHealthInitial * 100))
    this.monsterBar.style.height = percentage+'%'
    if(percentage < 1){
      console.log('monster dead!!!!');
      this.playerManager.endCombat();
    }
  }
  monsterMiss(tile){
    tile.visible = tile[this.weapon] = false;
    tile.monsterZone = true;
    const monsterRowTile = this.topTiles[tile.id];
    if(monsterRowTile) monsterRowTile[this.weapon] = monsterRowTile.visible = monsterRowTile.slowFade = true;
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
