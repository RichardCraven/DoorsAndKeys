import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import {PlayerManagerService} from '../services/player-manager.service'
import {MapsService} from '../services/maps.service'
import {MonstersService} from '../services/monsters.service';
import { ViewChild, ElementRef } from '@angular/core';
import { Subscription, Observable, Subject, interval, timer } from 'rxjs';
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

// import {InfoPanelComponent} from '../info-panel/info-panel.component'
@Component({
  selector: 'main-board',
  templateUrl: './main-board.component.html',
  styleUrls: ['./main-board.component.css']
})
export class MainBoardComponent implements OnInit, OnDestroy {
  tileSize = 100;
  boardSize = 1500;

  newPlayerSubscription: Subscription;
  playerManagerSubscription: any;

  sub1;
  delayed500 = new Subject<any>();
  introVideo = false;
  totalTiles = 225;
  rowLength = 15;
  idCount = 0;
  floatingCounter = 0;
  stopTimer = false;
  turnStarted = false;
  showCombatBoard = false;
  showDeathScreen = false;
  engagedMonster = {};
  pyramidLevel = 'mid';
  itemPickup;
  canvas;
  monstersArr = ['imp','imp_overlord','beholder','dragon','goblin','horror','ogre',
        'sphinx','troll','slime_mold','black_vampire','black_gorgon',
        'mummy','naiad','wyvern','skeleton','giant_scorpion','black_djinn','black_kronos',
        'black_banshee','black_wraith', 'manticore','black_minotaur'];
  middleTiles = [];
  topTiles = [];
  bottomTiles = [];
  currentTiles = [];
  spawnPoints: any;
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
    lantern: 2,
    disguise: 2,
    buddha: 0,
    stairs: 1,
    door: 2,
    cloud: 1
  }
  @ViewChild('myCanvas') myCanvas: ElementRef;
  // public context: CanvasRenderingContext2D;


  constructor(public playerManager: PlayerManagerService, public mapsService: MapsService, public monstersService: MonstersService) { 
    this.setTileSize();
  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.setTileSize();
  }
  setTileSize(){
    const h = Math.floor((window.innerHeight/10)*0.60);
    const w = Math.floor((window.innerWidth/10)*0.60);
    console.log('heigfht is: ', h, w)
    if(h < w){
      this.tileSize = h;
      this.boardSize = h*15
    } else {
      this.tileSize = w;
      this.boardSize = w*15
    }
    this.renderBoard();
  }
  ngOnInit() {
    window.focus();

    //Subdscribe to timers
    this.sub1 = this.getDelayed500().subscribe( res => {
      this.functionRouter(res)
    })


    for(let v = 0; v<3; v++){
      
      this.idCount = 0;
      for (let i = 0; i<this.totalTiles; i++){
        let tile = {
          id : this.idCount,
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
          edge: false,
          green: false,
          red: false,
          darkness: false,
          void: false,
          coordinates: [],
          title: false,
          title1: false,
          title2: false,
          title3: false,
          spawn_point: false,
          level: ''
        }
        if(v === 0){
          tile.level = 'top'
          this.topTiles.push(tile)
        } else if(v === 1){
          tile.level = 'middle'; 
          // console.log('midtile: ', tile)
          this.middleTiles.push(tile)
        } else {
          tile.level = 'bottom'; 
          // console.log('bottile: ', tile)
          this.bottomTiles.push(tile)
        }
        this.idCount++
      }
    }
    this.assignEdges();

    //DEFINING EDGES, NEED TO CHANGE THIS IF YOU CHANGE BOARD SIZE
    
    this.playerManagerSubscription = this.playerManager.getPlayerActivity().subscribe(res => {
      // console.log('activity res is ', res)
      this.handlePlayerServiceSubscription(res)
    })

    if(this.introVideo){
      this.middleTiles[112].occupied = this.middleTiles[112].contains = true;

      // const step1 = timer(1000);
      const step1 = timer(500);
      const step2 = timer(1500);
      const step3 = timer(2750);
      const step4 = timer(4100);
      const step5 = timer(4850);
      //^keys
      const step6 = timer(7250);
      const step7 = timer(9250);
      const step8 = timer(9850);

      const step1Sub = step1.subscribe(val => {
        for(var t in this.middleTiles){
          var tile = this.middleTiles[t]
          tile.visible = true;
        }
        this.buildVoid()
      });
      const step2Sub = step2.subscribe( res => {
        const greenZone = [110,111,113,114,96,97,98,82,126,127,128,142]
        for(let r = 0; r < greenZone.length; r++){
          this.clearTile(this.middleTiles[greenZone[r]])
        }
        const visibility = this.playerManager.checkVisibility(112, 2)
        for(var t in this.middleTiles){
          if(t !== '112'){
            var tile = this.middleTiles[t]
            this.clearTile(tile, true)

          }
          if(visibility.indexOf(tile.id) > -1){
            tile.visible = true;
            tile.void = false;
          } 
          this.paintMoveZone([7,7])
        }
      })
      const step3Sub = step3.subscribe( res => {
        // console.log('step 3: DOORS');
         const tiles = this.middleTiles
         for(let i = 19; i <= 23; i++){
           this.clearTile(tiles[i], false)
           tiles[i].visible = false;
           tiles[i].void = false;
           tiles[i].title = true;
         }
         this.middleTiles[37].visible = false; 
         this.middleTiles[37].title = true;
         this.middleTiles[52].void = false; 
        const door1 = timer(200);
        const door2 = timer(500);
        const door3 = timer(700);
        const door4 = timer(900);
        const door5 = timer(1100);
        const door6 = timer(1500);
        door1.subscribe(res => {
          tiles[19].title1 = true;
        })
        door2.subscribe(res => {
          tiles[20].title2 = true;
        })
        door3.subscribe(res => {
          tiles[21].title3 = true;
        })
        door4.subscribe(res => {
          tiles[22].title4 = true;
        })
        door5.subscribe(res => {
          tiles[23].title5 = true;
        })
        door6.subscribe(res => {
          tiles[37].title6 = true;
        })
      })
      const step5Sub = step5.subscribe( res => {
        const keys1 = timer(200);
        const keys2 = timer(400);
        const keys3 = timer(600);
        const keys4 = timer(800);
        keys1.subscribe(res => {
          this.middleTiles[51].title = this.middleTiles[51].title7 = true;
        })
        keys2.subscribe(res => {
          this.middleTiles[52].title = this.middleTiles[52].title8 = true;
        })
        keys3.subscribe(res => {
          
          this.middleTiles[53].title = this.middleTiles[53].title9 = true;
        })
        keys4.subscribe(res => {
          this.middleTiles[54].title = this.middleTiles[54].title10 = true;
        })
      })
      const step6Sub = step6.subscribe( res => {
        this.clearBoard();       
      })
      const populateBoard = step7.subscribe( res => {
        // this.populateBoard('top');
        console.log('in here?');
        
        this.populateBoard('mid');
        this.populateBoard('bottom');
        this.renderBoard()
      });
    } else {
      // INTRO SKIPPED
      this.clearBoard();
      // this.populateBoard('top');
      this.populateBoard('mid');
      this.populateBoard('bottom');
      this.renderBoard();
      this.spawnPlayer();
      console.log('PY level: ', this.pyramidLevel)      
    }
    
  }
  functionRouter(string){
    let monsterTile = this.middleTiles[this.engagedMonster['location']]
    let playerTile = this.middleTiles[this.playerManager.activePlayer.location]
    switch (string){
      case 'removeMonster':
        monsterTile.monster = monsterTile[monsterTile.contains] = monsterTile.selected = monsterTile.highlight = false;
        monsterTile.contains = '';
        this.playerManager.movementLocked = false;
        // var highestTimeoutId = setTimeout(";");
        // for (var i = 0 ; i < highestTimeoutId ; i++) {
        //     clearTimeout(i); 
        // }
      break
      case 'removePlayer':
        playerTile.occupied = false;
        playerTile.contains = '';
        this.delayed500.next('showDeathScreen')
      break
      case 'gainItem':
        this.itemPickup[this.itemPickup.contains] = false;
        this.itemPickup.highlight = this.itemPickup.selected = false;
        this.itemPickup.contains = '';
      break
      case 'showDeathScreen':
        this.playerManager.globalSubject.next({showDeathScreen: true})
      break
    }
  }

  clearBoard(){
    for(var t in this.middleTiles){
      let tile = this.middleTiles[t]
      this.clearTile(tile)
    }
  }

  buildVoid(){
    const tiles = this.middleTiles;
    for(let t in tiles){
      if(!tiles[t].contains){
        let num = Math.random()
        if(num >0.65){
          tiles[t].contains = 'void';
          tiles[t].void = true;
        }
      }
    }
  }
  populateBoard(board){
    console.log('board is ', board)
    let tileset;
    switch(board){
      case 'top':
        tileset = this.topTiles;
      break;
      case 'mid':
        tileset = this.middleTiles;
      break;
      case 'bottom':
        tileset = this.bottomTiles;
      break;
    }
      // const newMap = this.mapsService.generateMap('bottom')
      const newMap = this.mapsService.generateMap(board)

      // console.log('escaped!')

      const voids = newMap['voids']
      const keys = newMap['keys']
      const lanterns = newMap['lanterns']
      const shields = newMap['shields']
      const stairs = newMap['stairs']
      const pits = newMap['pits'];
      const cloud = newMap['cloud']
      const headgear = newMap['headgear']
      const doors = newMap['doors']
      const weapons = newMap['weapons']
      const charms = newMap['charms']
      const spawn_points = newMap['spawns']
      if(board === 'mid'){
        this.spawnPoints = newMap['spawns']
      }
      
      const weaponsArr = ['sword', 'axe', 'flail', 'spear', 'scepter'];
      const wandsArr = ['maerlyns_rod', 'glindas_wand', 'vardas_wand'];
      const headgearArr = ['bundu_mask', 'court_mask', 'lundi_mask', 'mardi_mask', 'solomon_mask', 'zul_mask', 'helmet'];
      const charmsArr = ['beetle_charm', 'demonskull_charm','evilai_charm','hamsa_charm','lundi_charm','nukta_charm','scarab_charm'];
      const amuletsArr = ['sayan_amulet','lundi_amulet','evilai_amulet','nukta_amulet',]
      const shieldsArr = ['seeing_shield','basic_shield'];
      
      const monstersArr = this.monstersArr;
      const demonsArr = ['black_demon','golden_demon','kabuki_demon','dulu_demon']
      const devils = ['zul','ishtar','mordu','goloth','vukular']
      
      //populate voids
      for(let a = 0; a < voids.length; a++){
        let point = this.coordinatePoint([voids[a][0],voids[a][1]])
        const tile = tileset[point];
        tile.void = true;
        tile.contains = 'void'
      }
      
      //populate keys
      for(let b = 0; b < keys.length; b++){
        let point = this.coordinatePoint([keys[b][0],keys[b][1]])
        const tile = tileset[point];
        tile.key = tile.item = true;
        tile.contains = 'key';
      }
      //populate lanterns
      for(let c = 0; c < lanterns.length; c++){
        let point = this.coordinatePoint([lanterns[c][0],lanterns[c][1]])
        const tile = tileset[point];
        tile.lantern = tile.item =  true;
        tile.contains = 'lantern'
      }
      
      //populate shields
      for(let s = 0; s < shields.length; s++){
        let point = this.coordinatePoint([shields[s][0],shields[s][1]])
        const tile = tileset[point];
        const shield = shieldsArr[Math.floor(Math.random() * shieldsArr.length)]
        tile[shield] = tile.item =  true;
        tile.contains = shield;
      }
      // tileset[this.coordinatePoint(shield)].shield = true;
      tileset[this.coordinatePoint(stairs)].stairs = true;
      tileset[this.coordinatePoint(stairs)].contains = 'stairs';
      
      tileset[this.coordinatePoint(pits[0])].pit = true;
      
      // tileset[this.coordinatePoint(headgear)].h = true;
      tileset[this.coordinatePoint(cloud)].cloud = true;
      tileset[this.coordinatePoint(cloud)].contains = 'cloud'
      // tileset[].shield = true
      
      //populate spawns
      for(let s = 0; s < spawn_points.length; s++){
        let point = this.coordinatePoint([spawn_points[s][0],spawn_points[s][1]])
        const tile = tileset[point];
        tile.spawn_point = true;
        tileset[point].contains = 'spawn_point';
      }
      //populate doors
      for(let d = 0; d < doors.length; d++){
        let point = this.coordinatePoint([doors[d][0],doors[d][1]])
        const tile = tileset[point];
        tile.door = true;
        tile.contains = 'door'
      }
      //populate weapons
      for(let e = 0; e < weapons.length; e++){
        let point = this.coordinatePoint([weapons[e][0],weapons[e][1]])
        const tile = tileset[point];
        const weapon = weaponsArr[Math.floor(Math.random() * weaponsArr.length)]
        tile[weapon] = tile.item = true;
        tile.contains = weapon;
      }
      //populate headgear
      for(let f = 0; f < headgear.length; f++){
        let point = this.coordinatePoint([headgear[f][0],headgear[f][1]])
        const tile = tileset[point];
        let headgearInstance = headgearArr[Math.floor(Math.random() * headgearArr.length)]
        tile[headgearInstance] = tile.item = true;
        tile.contains = headgearInstance;
      }
      //populate charms
      for(let g = 0; g < charms.length; g++){
        let point = this.coordinatePoint([charms[g][0],charms[g][1]])
        const tile = tileset[point];
        let charm = charmsArr[Math.floor(Math.random() * charmsArr.length)]
        tile[charm] = tile.item = true;
        tile.contains = charm;
      }
      console.log('populating monsters')
      //populate monsters
      let numOfMonsters = Math.floor(Math.random() * 14 + 5)

      let count = 0;
      while(numOfMonsters > 0){
        // const monster = monstersArr[Math.floor(Math.random()*monstersArr.length)]
        let okToContinue = true;
        // console.log('okContoniue ', okToContinue, tileset.length)
        let num = Math.floor(Math.random() * tileset.length)
        let arr = this.whatsAdjacent(this.pointToCoordinates(num))
        for(let i = 0; i < arr.length; i++){
          if(monstersArr.indexOf(arr[i].contains) > -1 || arr[i].spawn_point){
            okToContinue = false;
            break
          }
        }
        if(okToContinue){
          let tile = tileset[num]
          if(!tile.void && !tile.contains || tile.contains === '' && !tile.spawn_point){
            const monster = monstersArr[Math.floor(Math.random()*monstersArr.length)]
            tile.contains = monster;
            tile.monster = true;
            //^assigns general monster property
            tile[monster] = true;
            //^assigns what type of monster
            numOfMonsters--
          } 
        }
        count++
        // console.log('count: ', count)
        if(count > 300){
          return
        }
        //WHILE LOOPS IS FUCKING WITH BOT TILES
      }
    }
    spawnPlayer(){
      console.log('spawning player')      
      let tileset = this.middleTiles;
      const spawn_points = this.spawnPoints;
        //Spawn Player
        for(var p in tileset){
          if(tileset[p].occupied){
            tileset[p].occupied = false;
          }
        }
        this.playerManager.activePlayer = null;
        // const spawn_point = spawn_points[Math.floor(Math.random()*spawn_points.length)]
        const spawn_point = spawn_points[1]
        this.playerManager.setCurrentMap(this.middleTiles)
        this.playerManager.newPlayer(this.coordinatePoint(spawn_point));
  }
  renderBoard(){
    console.log('pyramiod level: ', this.pyramidLevel)
    switch(this.pyramidLevel){
      case 'mid':
        // console.log('mid tiles: ', this.middleTiles)
        this.middleTiles.forEach((tile, index)=>{

          this.currentTiles[index] = this.middleTiles[index]
          return
          console.log(tile.contains)
          if(tile.contains === null){
            
          }
          tile.void = true;
          tile.occupied = false;
          tile.buildable = false;
          tile.door = false;
          tile.stairs = false;
          tile.cloud = false;
          tile.crown = false;
          tile.skull = false;
          tile.lantern = false;
          tile.key = false;
          tile.buddha  = false;
          tile.monster = false;
          tile.spawn_point = false;
          tile.disguise = false;
          tile.visible = false;
          tile.occupied = false;
          // tile = {
          //   id : this.idCount,
          //   occupied : false,
          //   buildable : false,
          //   contains: '',
          //   door: false,
          //   stairs: false,
          //   cloud: false,
          //   palm_tree: false,
          //   crown: false,
          //   skull: false,
          //   key: false,
          //   lantern: false,
          //   disguise: false,
          //   buddha: false,
          //   visible: false,
          //   monster: false,
          //   edge: false,
          //   green: false,
          //   red: false,
          //   darkness: false,
          //   void: false,
          //   coordinates: [],
          //   title: false,
          //   title1: false,
          //   title2: false,
          //   title3: false,
          //   spawn_point: false
          // }
        })
        this.playerManager.setCurrentMap(this.currentTiles)
      break;
      case 'bottom':
        console.log('bot tiles: ', this.bottomTiles)
        this.bottomTiles.forEach((tile, index)=>{
          this.currentTiles[index] = this.bottomTiles[index]
          return
          // console.log(tile.contains)
        })
        this.playerManager.setCurrentMap(this.currentTiles)
      break;
    }
  }
  assignEdges(){
    const tiles = this.middleTiles;
    const totalTiles = this.totalTiles;
    const rowLength = this.rowLength;
    for(var t in tiles){
      //assigning coordinates
      let coordinates = [Math.floor(tiles[t].id %this.rowLength), Math.floor(tiles[t].id /this.rowLength)]
      tiles[t].coordinates = coordinates;
      if(tiles[t].id >= 0 &&  tiles[t].id <= rowLength-1){
        tiles[t].edge = 'top'
      }
      if(tiles[t].id >= totalTiles && tiles[t].id <= totalTiles-1){
        tiles[t].edge = 'bottom'
      }
      if(tiles[t].id % rowLength === 0){
        tiles[t].edge = 'left'
      }
      if((tiles[t].id - (rowLength-1))%rowLength === 0){
        tiles[t].edge = 'right'
      }
      //need to change edge property to an array so you can have multiple edges (for corners)?
    }
  }
  handlePlayerServiceSubscription(res){
    const player = this.playerManager.activePlayer;
    console.log('res: ' , res, this.currentTiles)
    const tile = this.currentTiles[res.location]
    console.log('and tile: ', tile)
    // if(!tile) return
    if(res.endCombat){
      if(res.playerDied){
        this.delayed500.next('removePlayer')
        this.showDeathPane()
      } else {
        this.delayed500.next('removeMonster')
      }
      // this.playerManager.addListeners()
      this.playerManager.movementLocked = true;
      this.showCombatBoard = false;
      this.playerManager.endCombat()
      this.playerManager.globalSubject.next({stopCombat: true})
      return
    }
    if(res.monster){
      if(res.monster.selected){
        this.engagedMonster = this.monstersService.library[res.monster.contains] 
        this.engagedMonster['location'] = res.monster.id;
        this.playerManager.requestItem('clear')
        this.playerManager.globalSubject.next({startCombat: true})
        this.playerManager.initiateCombat()
        this.showCombatBoard = true;
      }
      if(res.monster.highlight){
        res.monster.selected = true;
      }
      return
    }
    if(res.item){
      if(res.item.selected){
        this.playerManager.gainItem(res.item.contains)
        this.itemPickup = res.item;
        this.itemPickup[this.itemPickup.contains] = false;
        this.itemPickup.highlight = this.itemPickup.selected = false;
        this.itemPickup.contains = '';
      }
      if(res.item.highlight){
        res.item.selected = true;
      }
      return
    }
    if(res.door){
      console.log('received door message');
      console.log('destination is ', res.door);
      if(this.pyramidLevel === 'mid'){
        document.body.style.backgroundColor = 'darkgrey'
        this.pyramidLevel = 'bottom'
        this.renderBoard()
      } else {
        document.body.style.backgroundColor = 'white'
        this.pyramidLevel = 'mid'
        this.renderBoard()
      }
      return
    }
    if(!res.startTurn){
      console.log('setting everything to invisible')
      for(var t in this.currentTiles){
        this.currentTiles[t].visible = false
      }
    }
    tile.contains = player;
    tile.visible = true;
    tile.occupied = true;
    if(res.old_location || res.old_location === 0){
      // console.log('spammm, curr tiles: ', res.old_location,  this.currentTiles)
      const old_tile = this.currentTiles[res.old_location]
      old_tile.contains = null;
      old_tile.occupied = false;
    }
    
    if(res.startTurn){
      this.startTurn()
    }

    //set visibility
    this.shroudMap();
    if(res.visibility){
      for(let v = 0; v < res.visibility.length; v++){
        if(this.currentTiles[res.visibility[v]] && !this.currentTiles[res.visibility[v]].void) this.currentTiles[res.visibility[v]].visible = true;
        // if(this.middleTiles[res.visibility])
      }
      player.coordinates = this.pointToCoordinates(player.location)

      const adjacent = this.whatsAdjacent(player.coordinates);
      let itemToPickUp = false;
      for(var w in adjacent){

        //NEED TO DO EDGE DETECTION HERE

        if(adjacent[w].monster){
          adjacent[w].highlight = true;
          adjacent[w].visible = true;
          this.playerManager.messageSubject.next({msg : 'monster adjacent: '+adjacent[w].contains+'! ', monster: adjacent[w], player: player});
        }
        if(adjacent[w].item){
          adjacent[w].highlight = true;
          itemToPickUp = adjacent[w].contains;
        }
      }
      if(itemToPickUp){
        this.playerManager.requestItem(itemToPickUp)
      }else {
        this.playerManager.requestItem('clear')
      }
    }
  }
  resetInventory(){
    this.boardInventory = {
      monster: 5,
      key: 2,
      skull: 1,
      crown: 1,
      lantern: 2,
      disguise: 2,
      buddha: 0,
      stairs: 1,
      door: 2,
      cloud: 1
    }
  }
  startTurn(){
    this.turnStarted = true;
    this.playerManager.activePlayer.coordinates = this.pointToCoordinates(this.playerManager.activePlayer.location)
    for(var t in this.middleTiles){
      var tile = this.middleTiles[t]
      tile.visible = false;
    }
  }
  onEnterKey($event){
    // console.log('WAYOOO, event is ', $event);
  }
  clearTile(tile, invisible = false){
    tile.monster = tile.green = tile.red = tile.occupied = tile.skull = tile.crown = tile.door =
    tile.key = tile.disguise = tile.lantern = tile.stairs = tile.void = tile.title = false;
    tile.contains = tile.selected = null;
    if(invisible){
      tile.visible = false;
    }
  }
  resetTiles(){
    for(let t in this.middleTiles){
      let tile = this.middleTiles[t]
      tile.highlight = tile.monster = tile.green = tile.red = tile.crown = tile.door =
      tile.key = tile.disguise = tile.lantern = tile.stairs = tile.void = tile.title1 =
      tile.title2 = tile.title3 = tile.title4 = tile.title5 = tile.title6 = tile.title7 =
      tile.title8 = tile.title9 = tile.title10 = false;
      tile.contains = null;
    }
  }
  clickTile(target){
    console.log(target)
    if(target.selected){
      this.playerManager.requestItem('clear')
      this.showCombatBoard = true;
      this.engagedMonster = this.monstersService.library[target.contains] 
      this.engagedMonster['location'] = target.id;
      return
    }
    if(target.highlight){
      target.selected = true;
    }
  }
  shroudMap(){
    for(let i = 0; i < this.middleTiles.length; i++){
      let tile = this.middleTiles[i]
      tile.visible = false;
      tile.highlight = false;
      tile.selected = false;
    }
  }
  checkDistance(coordinates1, coordinates2){
    let newX = coordinates1[0] - coordinates2[0]
    let newY = coordinates1[1] - coordinates2[1]

    console.log('distance is ', Math.hypot((coordinates1[0] - coordinates2[0]),(coordinates1[1] - coordinates2[1])))
    
    //CANVAS PLAY
    // this.context.fillRect(0, 0, 100, 100);
    // this.context.strokeRect(coordinates1[0]*6.66, coordinates1[1]*6.66, 10, 10);
    
    // this.context.lineWidth = 0.1;
    // this.context.beginPath();
    // this.context.moveTo(coordinates1[0]*3.33,coordinates1[1]*3.33);
    // this.context.lineTo(coordinates2[0]*3.33, coordinates2[1]*3.33);
    // this.context.stroke();
    
  }
  pointToCoordinates(location){
    return [Math.floor(location%this.rowLength), Math.floor(location/this.rowLength)]
  }
  isLeft(coordinates){
    if(coordinates[0] > this.rowLength/2) return false
    return true
  }
  paintMoveZone(coords = this.playerManager.activePlayer.coordinates){
    // const coords = this.playerManager.activePlayer.coordinates
    // let coords = coords
    const moves = this.playerManager.activePlayer ? this.playerManager.activePlayer.moves : 2
    for(let i = 0; i <3; i++){
      let leftPoint = this.coordinatePoint([coords[0]-i, coords[1]])
      let rightPoint = this.coordinatePoint([coords[0]+i, coords[1]])
      let upperPoint = this.coordinatePoint([coords[0], coords[1]-i])
      let lowerPoint = this.coordinatePoint([coords[0], coords[1]+i])
      let upperLeftPoint = this.coordinatePoint([coords[0]-i, coords[1]-i])
      let upperRightPoint = this.coordinatePoint([coords[0]+i, coords[1]+i])
      let lowerRightPoint = this.coordinatePoint([coords[0]+i, coords[1]-i])
      let lowerLeftPoint = this.coordinatePoint([coords[0]-i, coords[1]+i])
      if(this.middleTiles[leftPoint]) this.middleTiles[leftPoint].green = true;
      if(this.middleTiles[rightPoint]) this.middleTiles[rightPoint].green = true;
      if(this.middleTiles[upperPoint]) this.middleTiles[upperPoint].green = true;
      if(this.middleTiles[lowerPoint]) this.middleTiles[lowerPoint].green = true;
      if(this.middleTiles[upperLeftPoint]) this.middleTiles[upperLeftPoint].green = true;
      if(this.middleTiles[upperRightPoint]) this.middleTiles[upperRightPoint].green = true;
      if(this.middleTiles[lowerLeftPoint]) this.middleTiles[lowerLeftPoint].green = true;
      if(this.middleTiles[lowerRightPoint]) this.middleTiles[lowerRightPoint].green = true;
      
    }
  }
  coordinatePoint(coordinates){
    return coordinates[1]*this.rowLength + coordinates[0]
  };

  whatsAdjacent(coords, radius = 1) {

    //NEED TO ACCOUNT FOR WRAP AROUND

    let adjacentItems = [];
    let checkCoords = function(coords, diagonal = ''){
      let tile = this.middleTiles[this.coordinatePoint(coords)]
      if(!tile) return
      if(diagonal === 'ul' && this.middleTiles[tile.id+1] && this.middleTiles[tile.id+1].void && this.middleTiles[tile.id+15].void) return
      if (diagonal === 'ur' && this.middleTiles[tile.id-1] && this.middleTiles[tile.id-1].void && this.middleTiles[tile.id+15] && this.middleTiles[tile.id+15].void) return
      if (diagonal === 'll' && this.middleTiles[tile.id+1] && this.middleTiles[tile.id+1].void && this.middleTiles[tile.id-15] && this.middleTiles[tile.id-15].void) return
      if (diagonal === 'lr' && this.middleTiles[tile.id-1] && this.middleTiles[tile.id-1].void && this.middleTiles[tile.id-15].void) return

      if(tile.contains || tile.spawn_point){
        adjacentItems.push(tile)
      }
    }.bind(this);

    checkCoords([coords[0],coords[1]+radius])
    checkCoords([coords[0]+radius,coords[1]])
    checkCoords([coords[0],coords[1]-radius])
    checkCoords([coords[0]-radius,coords[1]])

    checkCoords([coords[0]+radius,coords[1]+radius], 'lr')
    checkCoords([coords[0]-radius,coords[1]-radius], 'ul')
    checkCoords([coords[0]-radius,coords[1]+radius], 'll')
    checkCoords([coords[0]+radius,coords[1]-radius], 'ur')
    return adjacentItems
  }
  getDelayed500(): Observable<any>{
    return this.delayed500.pipe(
      delay(500)
    )
  }
  showDeathPane(){
    console.log('showing death pane');
    this.showDeathScreen = true;
    
  }
  ngOnDestroy(){
    this.playerManagerSubscription.unsubscribe();
  }
}
