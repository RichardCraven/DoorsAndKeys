import { Component, Input, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import {PlayerManagerService} from '../services/player-manager.service'
import {ItemsService} from '../services/items.service'
import {Projectile} from '../canvas-components/projectile.component'
import {Avatar} from '../canvas-components/avatar.component'
import {CollisionManagerService} from '../services/collision-manager.service'
import {ProjectileManagerService} from '../services/projectile-manager.service'
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

  avatar;
  gateOpen = false;

  topTilesCount = 10;
  botTilesCount = 10;
  gridTilesCount = 80;
  round = 0;
  tick = 0;
  differential = 0;
  monsterDefeated;
  monsterInfoLine1;
  monsterInfoLine2;
  playerInfo;
  topTiles = [];
  botTiles = [];
  gridTiles = [];
  roundNumTiles = [];
  layer = 5;
  numbers = ['zero','one','two','three','four','five','six','seven','eight','nine',];
  monsterAttackOrigins = [];
  monsterHealthInitial = 0;
  monsterHealth = 0;
  playerHealth = 100;
  playerHealthInitial = 100;

  playerX;
  playerX_destination;
  playerY;
  playerY_destination;
  
  playerTilePositionX;
  playerTilePositionY;
  
  monster_attack_positionX;
  monster_attack_destinationX;
  monster_attack_positionY;
  monster_attack_destinationY;
  monster_attack_iteration = 0;
  monsterWeapon;
  monsterIcon = {};
  monsterMovementZoneStartpoint;
  monsterMovementZoneEndpoint;
  monsterMovementLeftEnd;
  monsterMovementRightEnd;
  monsterMovementMiddle;

  windowOpen = false;
  playerLocked = false;
  showBar = true;
  wandAvailable = true;
  canvas;
  sub1;
  sub2;
  sub3;
  sub4;
  playerManagerSubscription;
  playerInventoryTiles = [];
  weapon;
  wand;
  amulet;


  weaponCount;
  weaponDamage;
  initialOpenWindow;
  monsterAttackTimer;
  showTimer;
  fadeTimer;
  monsterEndpoint;
  monsterBar;
  playerBar;
  canvasLeft;
  canvasTop;
  spellCasting = false;

  @Input()monster

  @ViewChild('combatCanvas') combatCanvas: ElementRef;
  public context: CanvasRenderingContext2D;

  constructor(
    public playerManager: PlayerManagerService, 
    public itemsService: ItemsService, 
    public collisionManagerService : CollisionManagerService,
    public projectileManagerService : ProjectileManagerService
    ) { 
    this.playerManagerSubscription = this.playerManager.getGlobalMessages().subscribe(res => {
      if(res.wandAvailable){
        this.wandAvailable = true;
      }
      if(res.weaponAvailable){
        this.weaponCount++
      }
      if(res === 'monster-struck'){
        this.monsterHit()
      }
    })
  }
  
  ngOnInit() {
    // <HTMLCanvasElement>this.combatCanvas.nativeElement.addEventListener('click', this.canvasClicked.bind(this, event))
    const canvas = <HTMLCanvasElement>this.combatCanvas.nativeElement;
    const board = document.getElementById('combat-board'); 

    this.canvasLeft = canvas.offsetLeft;
    this.canvasTop = canvas.offsetTop;

    <HTMLCanvasElement>this.combatCanvas.nativeElement.addEventListener('click', this.canvasClicked.bind(this), event )
    const inventory = this.playerManager.activePlayer.inventory;
    
    //CREATE PROJECTILE CANVAS
    let projectileCanvas = <HTMLCanvasElement>document.createElement('canvas');
    projectileCanvas.id = 'projectile-canvas';
    projectileCanvas.width  = 1000;
    projectileCanvas.height = 1000;
    projectileCanvas.style.position = "absolute";
    projectileCanvas.style.zIndex = '10'
    board.appendChild(projectileCanvas)
    // const projectileCanvas = <HTMLCanvasElement>document.getElementById('projectile-canvas');
    this.projectileManagerService.receiveCanvas(projectileCanvas)

    //CREATE PLAYER CANVAS
    let playerCanvas = <HTMLCanvasElement>document.createElement('canvas');
    playerCanvas.id = 'player-canvas';
    playerCanvas.width  = 1000;
    playerCanvas.height = 1000;
    playerCanvas.style.position = "absolute";
    playerCanvas.style.zIndex = '11'
    // playerCanvas.style.border = '1px solid yellow'
    board.appendChild(playerCanvas)
    
    // ****** ! None of this is currently used

    // for(let i = 0; i < inventory.weapons.length; i++){
    //   let tile = {};
    //   tile[inventory.weapons[i].type] = true;
    //   this.playerInventoryTiles.push(tile)
    // }
    // for(let w = 0; w < inventory.wands.length; w++){
    //   let tile = {};
    //   tile[inventory.wands[w].type] = true;
    //   this.playerInventoryTiles.push(tile)
    // }
    // for(let s = 0; s < inventory.shields.length; s++){
    //   let tile = {};
    //   tile[inventory.shields[s].type] = true;
    //   this.playerInventoryTiles.push(tile)
    // }
    // for(let h = 0; h < inventory.headgear.length; h++){
    //   let tile = {};
    //   tile[inventory.headgear[h].type] = true;
    //   this.playerInventoryTiles.push(tile)
    // }
    // for(let c = 0; c < inventory.charms.length; c++){
    //   let tile = {};
    //   tile[inventory.charms[c].type] = true;
    //   this.playerInventoryTiles.push(tile)
    // };
    this.monsterHealthInitial = this.monster.health;
    this.monsterHealth = this.monster.health;

    this.monsterBar = document.getElementById("monster-health-bar");
    this.monsterBar.style.height = 0+'%'

    this.monsterInfoLine1 = this.monster.combatMessages.greeting
    // this.playerManager.initiateCombat()

    window.addEventListener('keydown', (event) => {
      switch(event.key){
        case 'ArrowLeft':
          this.movePlayer('left')
        break
        case 'ArrowRight':
          this.movePlayer('right')
        break
        case 'ArrowUp':
          this.movePlayer('up')
        break
        case 'ArrowDown':
          this.movePlayer('down')
        break
        case 'z':
        this.addCastSpell();
        break
        case 'q':
          console.log('q')
          this.canvasLine(1,2)
        break
        case ' ':
          this.addAttack()
          
        break
        case 'Meta':
        this.spellCasting = true;
          // this.addCastSpell()
        break
      }
    }, false);

    window.addEventListener('keyup', (event) => {
      switch(event.key){
        case 'Meta':
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
    // this.botTiles[5].visible = true;
    // this.botTiles[5].occupied = true;
    this.playerTilePositionX = 5;
    this.playerTilePositionY = 9;


    // let newCanvas = document.createElement('canvas');
    //   let board = document.getElementById('combat-board'); 
    //   newCanvas.id     = "PlayerLayer";
    //   newCanvas.width  = 1000;
    //   newCanvas.height = 1000;
    //   newCanvas.style.position = "absolute";
    //   newCanvas.style.zIndex = '20'
    //   // newCanvas.style.zIndex   = this.layer;
    //   newCanvas.style.border   = "5px solid red";

    //   let imgTag = new Image();
    //   // imgTag.src = '../../assets/scavenger.png'
    //   // imgTag.src = '../../assets/icons/items/weapons/spear_white.png'
    //   imgTag.src = '../../assets/icons/avatar_white.png'
    //   imgTag.height = 100
    //   imgTag.width = 100
    //   let newContext = newCanvas.getContext("2d");

    //   newContext.clearRect(0, 0, newCanvas.width, newCanvas.height);
    //   newContext.drawImage(imgTag, 200, 400);  
    //   board.appendChild(newCanvas)


    






    ///
    // let newCanvas = document.createElement('canvas');
    // newCanvas.style.position = "absolute";
    // newCanvas.style.zIndex = "100";
    // newCanvas.id  = "playerCanvas";
    //   newCanvas.width  = 1000;
    //   newCanvas.height = 1000;
    //   let board = document.getElementById('combat-board'); 
    // let imgTag = new Image();
    // // imgTag.onload = animate;
    // // imgTag.src = '../../assets/scavenger.png'
    // imgTag.src = '../../assets/icons/avatar_white.png'
    // imgTag.height = 100
    // imgTag.width = 100
    // let newContext = newCanvas.getContext("2d");
    // newContext.drawImage(imgTag, 50, 50);  
    // board.appendChild(newCanvas)

    ///

    this.monsterIcon[this.monster.type] = true
    
    this.weapon = this.playerManager.activePlayer.inventory.weapons[0];
    this.wand = this.playerManager.activePlayer.inventory.wands[0]

    this.weaponCount = this.weapon.attack;
    this.weaponDamage = this.weapon.damage;
    this.monsterWeapon = 'down';

    const max = this.topTiles.length
    this.monsterMovementZoneStartpoint = this.monsterEndpoint - this.monster.agility >= 0 ? this.monsterEndpoint - this.monster.agility : 0
    this.monsterMovementZoneEndpoint = this.monsterEndpoint + this.monster.agility <= max ? this.monsterEndpoint + this.monster.agility : max

    this.placePlayer()


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


    this.collisionManagerService.detectCollision().subscribe(res => {
      !this.playerLocked && this.playerHit();
      // console.log(res.y_value)
      this.playerTilePositionY = 9
      this.avatar.destinationY = 900
    })
  }
  degreesToRadians(degrees){
    return degrees * Math.PI /180
  }
  placePlayer(){
    const playerCanvas = <HTMLCanvasElement>document.getElementById('player-canvas');
    // const context = playerCanvas.getContext("2d");
    // const board = document.getElementById('combat-board'); 
    // playerCanvas.style.border   = "1px solid red";
    let imgTag = new Image();
    imgTag.src = '../../assets/icons/avatar_white.png'

    this.playerX_destination = 500;
    this.playerX = 500;
    this.playerY_destination = 900;
    this.playerY = 900;

    this.avatar = new Avatar(playerCanvas, this.playerX, this.playerY, this.weapon.type , this.collisionManagerService, this.projectileManagerService, this.playerManager)

    this.avatar.destinationX = 500;
    this.avatar.destinationY = 900;

    this.avatar.init()
    // let x = 500
    // let y = 1000-100
      
    // context.drawImage(imgTag, this.playerX, this.playerY, 250, 250);  
    // board.appendChild(playerCanvas)

    // animate.bind(this)()
    // function animate() {
    //   if(this.playerX === this.playerX_destination){
    //     context.clearRect(0, 0, playerCanvas.width, playerCanvas.height);  
    //     context.drawImage(imgTag, this.playerX, this.playerY); 
    //   } else if(this.playerX_destination > this.playerX){
    //     this.playerX += 25
    //     context.clearRect(0, 0, playerCanvas.width, playerCanvas.height); 
    //     context.drawImage(imgTag, this.playerX, this.playerY); 
    //   } else if(this.playerX_destination < this.playerX){
    //     this.playerX -= 25
    //     context.clearRect(0, 0, playerCanvas.width, playerCanvas.height); 
    //     context.drawImage(imgTag, this.playerX, this.playerY); 
    //   }
    //   this.collisionManagerService.updatePlayerPosition(this.playerX, this.playerY)
    //   requestAnimationFrame(animate.bind(this))
    // }
  }
  canvasClicked(event){
    // console.log('coords: ', event.offsetX, event.offsetY, this)
    // const canvas = <HTMLCanvasElement>this.combatCanvas.nativeElement
    // const head = <HTMLCanvasElement>document.getElementById('head')

    // console.log('viggo ', head.width, head.height);
    

    
    // const context = this.context;

    // let x = event.offsetX - head.width
    // let y = event.offsetY - head.height


    // animate.bind(this)()
    // function animate() {
    //   context.clearRect(0, 0, canvas.width, canvas.height);  // clear canvas
    //   context.drawImage(head, x, y);                       // draw image at current position
    //   x -= 6;
    //   if (x > -11) requestAnimationFrame(animate)
    // }



    loadCanvas.bind(this)(this.tick)
    function loadCanvas(id) {
      let newCanvas = document.createElement('canvas');
      let board = document.getElementById('combat-board'); 
      newCanvas.id     = "CursorLayer"+id;
      newCanvas.width  = 1000;
      newCanvas.height = 1000;
      newCanvas.style.position = "absolute";
      newCanvas.style.zIndex = this.layer.toString()
      // newCanvas.style.zIndex   = this.layer;
      newCanvas.style.border   = "1px solid red";

      let imgTag = new Image();
      // imgTag.src = '../../assets/scavenger.png'
      // imgTag.src = '../../assets/icons/items/weapons/spear_white.png'
      imgTag.src = '../../assets/icons/avatar_white.png'
      imgTag.height = 100
      imgTag.width = 100
      let newContext = newCanvas.getContext("2d");

      // let x = event.offsetX - imgTag.width
      // let y = event.offsetY - imgTag.height
      let x = 600
      let y = 600
      
      newContext.drawImage(imgTag, x, y);  
      
      // console.log(event.offsetX, event.offsetY )
      board.appendChild(newCanvas)
      this.tick++
      this.layer++
      
      animate.bind(this)()
      function animate() {
        newContext.clearRect(0, 0, newCanvas.width, newCanvas.height);  // clear canvas
        newContext.drawImage(imgTag, x, y);                       // draw image at current position
        y -= 20;
        if (y > 0) requestAnimationFrame(animate)
          else board.removeChild(newCanvas)
      }

      
      newCanvas.addEventListener('click', this.canvasClicked.bind(this), event )
    }
  }
  canvasLine(coordinates1, coordinates2){
    console.log('in canvas line');
    
    // let newX = coordinates1[0] - coordinates2[0]
    // let newY = coordinates1[1] - coordinates2[1]

    // console.log('distance is ', Math.hypot((coordinates1[0] - coordinates2[0]),(coordinates1[1] - coordinates2[1])))
    
    //CANVAS PLAY
    // this.context.fillStyle = 'blue'
    // this.context.fillRect(0, 0, 100, 100);
    // this.context.strokeRect(coordinates1[0]*6.66, coordinates1[1]*6.66, 10, 10);
    // this.context.drawImage(head, 0, 0, 1000, 1000, 80, 80, 1000, 1000)


    // var imgTag = new Image();
    // imgTag.onload = animate;
    // imgTag.src = "http://i.stack.imgur.com/Rk0DW.png";

  
      console.log(this.tick);
      const canvas = <HTMLCanvasElement>this.combatCanvas.nativeElement
      let x = canvas.width/2;
      let y = canvas.height/2;
      // let width = head.width;
      // let height = head.height;
  
      // this.context.clearRect(0,0,1000,1000)
      // this.context.translate(x,y);
      // this.context.rotate(this.degreesToRadians(90))
      // this.context.drawImage(head, -width/2, -height/2, width+this.tick, height)
      // this.context.translate(-x, -y)
      
      // this.tick ++
      // if(this.tick > 5000){
      //   console.log('clear');
        
      
      //   clearInterval(animation)
      // }
      const head = <HTMLCanvasElement>document.getElementById('head')
      console.log(head);
      const context = this.context;
      animate.bind(this)()
      function animate() {
        context.clearRect(0, 0, canvas.width, canvas.height);  // clear canvas
        context.drawImage(head, x, y);                       // draw image at current position
        x -= 6;
        if (x > -11) requestAnimationFrame(animate)
      }

   
    // this.context.lineWidth = 0.1;
    // this.context.beginPath();
    // this.context.moveTo(coordinates1[0]*3.33,coordinates1[1]*3.33);
    // this.context.lineTo(coordinates2[0]*3.33, coordinates2[1]*3.33);
    // this.context.stroke();
    
  }
  rotateAndPaintImage(context, image, angleInRad, positionX, positionY, axisX, axisY){

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
    if(this.spellCasting && !this.playerLocked && tile.placementZone && this.wandAvailable){
      tile.visible = true;
      tile[this.wand.type] = true;
      this.wandAvailable = false;
      this.playerManager.attackPing.next({wand:this.wand})
    } else if(this.spellCasting && !this.wandAvailable){
      return
    } else if(tile.placementZone && this.weaponCount && !tile[this.weapon.type] && !this.playerLocked){
      tile.visible = true;
      tile[this.weapon.type] = true;
      this.weaponCount--
      this.playerManager.attackPing.next({weapon:this.weapon})
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
      this.gridTiles[t][this.monsterWeapon] = this.gridTiles[t][this.wand.type] = this.gridTiles[t][this.weapon.type] = this.gridTiles[t].visible = false;
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
    if(round === 1){
      // debugger
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
    
    
    // this.weaponCount = this.weapon.attack;
    // this.wandAvailable = true;
    //this is where you need to listen to weapon recharge

    this.openGate()
    this.gateOpen = true;

    return 'openWindow'
  }
  
  openGate(){
    let that = this;
    if(!this.gateOpen){
      var elem = document.getElementById("midGate"); 
        var width = 1;
        var id = setInterval(function(){
          if (width >= 100) {
            clearInterval(id);
            that.revealMonster();
            // that.playerLocked = true;
            that.delayed500.next('closeWindow')
            that.delayed500.next('monsterAttack')
          } else {
            width++; 
            elem.style.width = width + '%'; 
            // console.log('width: ', width * 10)
            that.collisionManagerService.midGateX = width*10
          }
        }, 25);
    } else {
      setTimeout(function(){
        that.revealMonster()
        that.delayed500.next('closeWindow')
        that.delayed500.next('monsterAttack')
      }, 2000)
    }
  }
  closeGate(){
    let that = this;
      var elem = document.getElementById("midGate"); 
      var width = 100;
      var id = setInterval(frame, 10);
      function frame() {
        if (width === 0) {
          clearInterval(id);
        } else {
          width--; 
          elem.style.width = width + '%'; 
          // that.collisionManagerService.midGateX = width*10
        }
      }
    
    
  }
  closeWindow(){
    this.round++
    this.showBar = false;
    for(let g in this.gridTiles){
      // if(this.gridTiles[g][this.weapon.type]){
      //   this.fireWeapon(this.gridTiles[g])
      // }
      // if(this.gridTiles[g][this.wand.type]){
      //   this.castSpells(this.gridTiles[g])
      // }
    }
    this.delayed500.next('revealBar')
    this.delayed750.next('showMovementZone')
    // this.delayed750.next('closeGate')
    this.delayed2000.next('openWindow')

    return 'closeWindow'
  }
  
  hideMonster(){
    for(let tile of this.topTiles){
      if(tile){
        tile[this.monster.type] = tile.visible = tile.monsterMovementLeftEnd = tile.monsterMovementMiddle = tile.monsterMovementRightEnd = false;
      } 
    }
    this.collisionManagerService.playerHit = false;
    this.projectileManagerService.clearProjectiles()
    this.collisionManagerService.updateMonsterPosition(null, null)
  }

  revealMonster(){
    this.avatar.reset()
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

    this.collisionManagerService.updateMonsterPosition(index*100, 50)

    let tile = this.topTiles[index];
    tile[this.monster.type] = tile.visible = true;
    this.monsterEndpoint = index;
  }

  showMovementZone(){
    const max = this.topTiles.length
    this.monsterMovementZoneStartpoint = (this.monsterEndpoint - this.monster.agility) >= 0 ? (this.monsterEndpoint - this.monster.agility) : 0
    this.monsterMovementZoneEndpoint = (this.monsterEndpoint + this.monster.agility) <= max ? (this.monsterEndpoint + this.monster.agility) : max
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

  castSpells(tile){
    const that = this;
    const id = tile.id
    const tiles = this.gridTiles;
    tile[this.wand.type] = false;
  }
  monsterAttack(){
    this.monsterAttackOrigins = [];
    // let attacks = this.monster.attack; 
    //to be replaced with monster attack from json
    this.monsterInfoLine1 = this.monster.combatMessages.attack[Math.floor(Math.random()*this.monster.combatMessages.attack.length)]
    
    let num = Math.floor(Math.random()* 30)
    const canvas = <HTMLCanvasElement>document.getElementById('projectile-canvas');

    console.log(this.monster.attack)
    let attacks = 3
    while(attacks > 0){
      let numX = Math.floor(Math.random()* 10)
      // let numX = 4

      let numY = Math.floor(Math.random()* 300)
      let delay = Math.floor(Math.random()*400)
      if(this.monsterAttackOrigins.indexOf(numX) < 0){
        attacks--
        this.monsterAttackOrigins.push(numX)
        let projectile = new Projectile(canvas, 'downWhite', numX*100, numY, this.collisionManagerService, this.projectileManagerService)
        const that = this;
        setTimeout(function(){
          that.projectileManagerService.projectiles.push(projectile)
        }, delay)
        
      }
    }
    this.projectileManagerService.beginSequence();
  }
  addAttack(){
    if(!this.weaponCount || this.playerLocked) return
    const wand = this.wand
    this.avatar.attack(this.weapon.type)
    this.playerManager.attackPing.next({weapon:this.weapon})
    this.weaponCount--
    

    return

    if(!this.gridTiles[this.playerTilePositionX + 70][this.weapon.type] && !this.gridTiles[this.playerTilePositionX + 70][wand.type]){
      this.gridTiles[this.playerTilePositionX + 70][this.weapon.type] = this.gridTiles[this.playerTilePositionX + 70].visible = true;
      this.playerManager.attackPing.next({weapon:this.weapon})
      this.weaponCount --
    } else if(!this.gridTiles[this.playerTilePositionX + 60][this.weapon.type] && !this.gridTiles[this.playerTilePositionX + 60][wand.type]){
      this.gridTiles[this.playerTilePositionX + 60][this.weapon.type] = this.gridTiles[this.playerTilePositionX + 60].visible = true;
      this.playerManager.attackPing.next({weapon:this.weapon})
      this.weaponCount --
    } else if(!this.gridTiles[this.playerTilePositionX + 50][this.weapon.type] && !this.gridTiles[this.playerTilePositionX + 50][wand.type]){
      this.gridTiles[this.playerTilePositionX + 50][this.weapon.type] = this.gridTiles[this.playerTilePositionX + 50].visible = true;
      this.playerManager.attackPing.next({weapon:this.weapon})
      this.weaponCount --
    }
  }
  addCastSpell(){
    
    if(!this.wandAvailable || this.playerLocked) return
    const wand = this.wand
    if(!this.gridTiles[this.playerTilePositionX + 70][wand.type] && !this.gridTiles[this.playerTilePositionX + 70][this.weapon.type]){
      this.gridTiles[this.playerTilePositionX + 70][wand.type] = this.gridTiles[this.playerTilePositionX + 70].visible = true;
      this.playerManager.attackPing.next({wand:wand})
      this.wandAvailable = false;
    } else if(!this.gridTiles[this.playerTilePositionX + 60][wand.type] && !this.gridTiles[this.playerTilePositionX + 60][this.weapon.type]){
      this.gridTiles[this.playerTilePositionX + 60][wand.type] = this.gridTiles[this.playerTilePositionX + 60].visible = true;
      this.playerManager.attackPing.next({wand:wand})
      this.wandAvailable = false;
    } else if(!this.gridTiles[this.playerTilePositionX + 50][wand.type] && !this.gridTiles[this.playerTilePositionX + 50][this.weapon.type]){
      this.gridTiles[this.playerTilePositionX + 50][wand.type] = this.gridTiles[this.playerTilePositionX + 50].visible = true;
      this.playerManager.attackPing.next({wand:wand})
      this.wandAvailable = false;
    }
  }
  checkMonsterHit(tile){
    if (!tile) return
    if(tile.id % 10 === this.playerTilePositionX) this.playerHit()
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
        that.avatar.monsterStruck = false;
        that.avatar.upDownNum = 0;
      }
      counter++
    }
    this.monsterHealth -= damage;
    this.playerInfo = 'You hit for ' + damage + ' damage!'

    this.monsterBar = document.getElementById("monster-health-bar");
    const percentage = (100 - (this.monsterHealth / this.monsterHealthInitial * 100))
    this.monsterBar.style.height = percentage+'%'
    if(this.monsterHealth < 1){
      this.monsterDefeated = true;
      this.delayed2000.next('endCombat-monsterDead')
    }
  }
  // monsterMiss(tile){
  //   tile.visible = tile[this.weapon.type] = false;
  //   tile.monsterZone = true;
  //   const monsterRowTile = this.topTiles[tile.id];
  //   if(monsterRowTile) monsterRowTile[this.weapon.type] = monsterRowTile.visible = monsterRowTile.slowFade = true;
  //   this.delayed750.next(monsterRowTile)
  // }
  playerHit(){
    this.playerLocked = true;
    const that = this;
    const flashInterval = setInterval(flash, 100)
    let counter = 0;
    function flash(){
      
      if(counter < 10){
        that.botTiles[that.playerTilePositionX].flash = !that.botTiles[that.playerTilePositionX].flash
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
      this.delayed2000.next('endCombat-playerDead')
    }
  }
  handlePlayerHit(){
    //check hit points


    //survived?
    for(let t in this.botTiles){
      this.botTiles[t].flash = false;
    }
    // this.botTiles[this.playerTilePositionX].flash = false;
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
    const botTiles = this.botTiles;
    const mainTiles = this.gridTiles;
    let endPointX = this.playerTilePositionX;
    let endPointY = this.playerTilePositionY;

    switch (direction){
      case 'left':
        if(this.playerX !== this.playerX_destination) return
        if(botTiles[endPointX - 1] && !botTiles[endPointX-1][this.monsterWeapon]){
          this.playerTilePositionX = this.playerTilePositionX - 1
          this.avatar.destinationX = this.playerTilePositionX*100;
        } 
      break
      case 'right':
        if(this.playerX !== this.playerX_destination) return
        if(botTiles[endPointX + 1] && !botTiles[endPointX+1][this.monsterWeapon]){
        this.playerTilePositionX = this.playerTilePositionX + 1
        this.avatar.destinationX = this.playerTilePositionX*100;
        } 
      break
      case 'up':
        // if(this.playerY !== this.playerY_destination) return
        if(endPointY > 1 && this.collisionManagerService.checkForGate('up')){
        this.playerTilePositionY = this.playerTilePositionY - 1
        this.avatar.destinationY = this.playerTilePositionY*100;
        } 
      break
      case 'down':
        // if(this.playerY !== this.playerY_destination) return
        if(endPointY < 9 && this.collisionManagerService.checkForGate('down')){
        this.playerTilePositionY = this.playerTilePositionY + 1
        this.avatar.destinationY = this.playerTilePositionY*100;
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
    this.sub1.unsubscribe();
    this.sub2.unsubscribe();
    this.sub3.unsubscribe();
    this.sub4.unsubscribe();
  
    this.playerManagerSubscription.unsubscribe();
  }
}
