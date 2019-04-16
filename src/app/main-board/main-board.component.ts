import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import {TileComponent} from '../tile/tile.component'
import {PlayerManagerService} from '../services/player-manager.service'
import {MapsService} from '../services/maps.service'
import {MonstersService} from '../services/monsters.service';
import { ViewChild, ElementRef } from '@angular/core';
import {InfoPanelComponent} from '../info-panel/info-panel.component';
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
  itemPickup;
  canvas;
  monstersArr = ['imp','imp_overlord','beholder','dragon','goblin','horror','ogre',
        'sphinx','troll','slime_mold','black_vampire','black_gorgon',
        'mummy','naiad','wyvern','skeleton','giant_scorpion','black_djinn','black_kronos',
        'black_banshee','black_wraith', 'manticore','black_minotaur'];
  tiles = [];
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


  constructor(public playerManager: PlayerManagerService, public mapsService: MapsService, public monstersService: MonstersService) { }

  ngOnInit() {
    // this.canvas = document.getElementById('myCanvas');
    
    window.focus();

    // this.context = (<HTMLCanvasElement>this.myCanvas.nativeElement).getContext('2d');
    // this.context.scale(16,16);
    // this.context = this.canvas.getContext('2d');

    //Subdscribe to timers
    this.sub1 = this.getDelayed500().subscribe( res => {
      this.functionRouter(res)
    })



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
        spawn_point: false
      }
      this.tiles.push(tile)
      this.idCount++
    }
    // this.populateBoard();
    this.assignEdges();

    //DEFINING EDGES, NEED TO CHANGE THIS IF YOU CHANGE BOARD SIZE
    
    this.playerManagerSubscription = this.playerManager.getPlayerActivity(this.tiles).subscribe(res => {
      this.handlePlayerServiceSubscription(res)
    })

    if(this.introVideo){
      this.tiles[112].occupied = this.tiles[112].contains = true;

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
        for(var t in this.tiles){
          var tile = this.tiles[t]
          tile.visible = true;
        }
        this.buildVoid()
      });
      const step2Sub = step2.subscribe( res => {
        const greenZone = [110,111,113,114,96,97,98,82,126,127,128,142]
        for(let r = 0; r < greenZone.length; r++){
          this.clearTile(this.tiles[greenZone[r]])
        }
        const visibility = this.playerManager.checkVisibility(112, 2)
        for(var t in this.tiles){
          if(t !== '112'){
            var tile = this.tiles[t]
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
         const tiles = this.tiles
         for(let i = 19; i <= 23; i++){
           this.clearTile(tiles[i], false)
           tiles[i].visible = false;
           tiles[i].void = false;
           tiles[i].title = true;
         }
         this.tiles[37].visible = false; 
         this.tiles[37].title = true;
         this.tiles[52].void = false; 
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
          this.tiles[51].title = this.tiles[51].title7 = true;
        })
        keys2.subscribe(res => {
          this.tiles[52].title = this.tiles[52].title8 = true;
        })
        keys3.subscribe(res => {
          
          this.tiles[53].title = this.tiles[53].title9 = true;
        })
        keys4.subscribe(res => {
          this.tiles[54].title = this.tiles[54].title10 = true;
        })
      })
      const step6Sub = step6.subscribe( res => {
        this.clearBoard();       
      })
      const populateBoard = step7.subscribe( res => {
        this.populateBoard();
      });
    } else {
      // INTRO SKIPPED
      this.clearBoard();
      this.populateBoard();
    }
    
  }
  functionRouter(string){
    let monsterTile = this.tiles[this.engagedMonster['location']]
    let playerTile = this.tiles[this.playerManager.activePlayer.location]
    switch (string){
      case 'removeMonster':
        monsterTile.monster = monsterTile[monsterTile.contains] = monsterTile.selected = monsterTile.highlight = false;
        monsterTile.contains = '';
        this.playerManager.movementLocked = false;
        var highestTimeoutId = setTimeout(";");
        for (var i = 0 ; i < highestTimeoutId ; i++) {
            clearTimeout(i); 
        }
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
    for(var t in this.tiles){
      let tile = this.tiles[t]
      this.clearTile(tile)
    }
  }

  buildVoid(){
    const tiles = this.tiles;
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
  populateBoard(){
        const newMap = this.mapsService.generateMap()
        const voids = newMap['voids']
        const keys = newMap['keys']
        const lanterns = newMap['lanterns']
        const shields = newMap['shields']
        const stairs = newMap['stairs']
        const cloud = newMap['cloud']
        const headgear = newMap['headgear']
        const doors = newMap['doors']
        const weapons = newMap['weapons']
        const charms = newMap['charms']
        const spawn_points = newMap['spawns']

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
          const tile = this.tiles[point];
          tile.void = true;
          // this.tiles[point].contains = 'void';
        }

        //populate keys
        for(let b = 0; b < keys.length; b++){
          let point = this.coordinatePoint([keys[b][0],keys[b][1]])
          const tile = this.tiles[point];
          tile.key = tile.item = true;
          tile.contains = 'key';
        }
        //populate lanterns
        for(let c = 0; c < lanterns.length; c++){
          let point = this.coordinatePoint([lanterns[c][0],lanterns[c][1]])
          const tile = this.tiles[point];
          tile.lantern = tile.item =  true;
          tile.contains = 'lantern'
        }

        //populate shields
        for(let s = 0; s < shields.length; s++){
          let point = this.coordinatePoint([shields[s][0],shields[s][1]])
          const tile = this.tiles[point];
          const shield = shieldsArr[Math.floor(Math.random() * shieldsArr.length)]
          tile[shield] = tile.item =  true;
          tile.contains = shield;
        }
        // this.tiles[this.coordinatePoint(shield)].shield = true;
        this.tiles[this.coordinatePoint(stairs)].stairs = true;
        this.tiles[this.coordinatePoint(stairs)].contains = 'stairs';
        // this.tiles[this.coordinatePoint(headgear)].h = true;
        this.tiles[this.coordinatePoint(cloud)].cloud = true;
        this.tiles[this.coordinatePoint(cloud)].contains = 'cloud'
        // this.tiles[].shield = true

        //populate spawns
        for(let s = 0; s < spawn_points.length; s++){
          let point = this.coordinatePoint([spawn_points[s][0],spawn_points[s][1]])
          const tile = this.tiles[point];
          tile.spawn_point = true;
          // this.tiles[point].contains = 'spawn_point';
        }
        //populate doors
        for(let d = 0; d < doors.length; d++){
          let point = this.coordinatePoint([doors[d][0],doors[d][1]])
          const tile = this.tiles[point];
          tile.door = true;
          tile.contains = 'door';
        }
        //populate weapons
        for(let e = 0; e < weapons.length; e++){
          let point = this.coordinatePoint([weapons[e][0],weapons[e][1]])
          const tile = this.tiles[point];
          const weapon = weaponsArr[Math.floor(Math.random() * weaponsArr.length)]
          tile[weapon] = tile.item = true;
          tile.contains = weapon;
        }
        //populate headgear
        for(let f = 0; f < headgear.length; f++){
          let point = this.coordinatePoint([headgear[f][0],headgear[f][1]])
          const tile = this.tiles[point];
          let headgearInstance = headgearArr[Math.floor(Math.random() * headgearArr.length)]
          tile[headgearInstance] = tile.item = true;
          tile.contains = headgearInstance;
        }
        //populate charms
        for(let g = 0; g < charms.length; g++){
          let point = this.coordinatePoint([charms[g][0],charms[g][1]])
          const tile = this.tiles[point];
          let charm = charmsArr[Math.floor(Math.random() * charmsArr.length)]
          tile[charm] = tile.item = true;
          tile.contains = charm;
        }
        //populate monsters
        let numOfMonsters = Math.floor(Math.random() * 14 + 5)
        while(numOfMonsters > 0){
          // const monster = monstersArr[Math.floor(Math.random()*monstersArr.length)]
          let okToContinue = true;
          let num = Math.floor(Math.random() * this.tiles.length)
          let arr = this.whatsAdjacent(this.pointToCoordinates(num))
          for(let i = 0; i < arr.length; i++){
            if(monstersArr.indexOf(arr[i].contains) > -1 || arr[i].spawn_point){
              okToContinue = false;
              break
            }
          }
          if(okToContinue){
            let tile = this.tiles[num]
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
        }

        //Spawn Player
        for(var p in this.tiles){
          if(this.tiles[p].occupied){
            this.tiles[p].occupied = false;
          }
        }
        this.playerManager.activePlayer = null;
        const spawn_point = spawn_points[Math.floor(Math.random()*spawn_points.length)]
        this.playerManager.newPlayer(this.coordinatePoint(spawn_point))
  }
  assignEdges(){
    const tiles = this.tiles;
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
    const tile = this.tiles[res.location]
    if(res.endCombat){
      if(res.playerDied){
        this.delayed500.next('removePlayer')
        // this.showDeathPane()
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
    if(!res.startTurn){
      for(var t in this.tiles){
        // this.tiles[t].visible = false
      }
    }
    tile.contains = player;
    tile.visible = true;
    tile.occupied = true;
    if(res.old_location || res.old_location === 0){
      const old_tile = this.tiles[res.old_location]
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
        if(this.tiles[res.visibility[v]] && !this.tiles[res.visibility[v]].void) this.tiles[res.visibility[v]].visible = true;
        // if(this.tiles[res.visibility])
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
    console.log('is left? ' , this.isLeft(this.playerManager.activePlayer.coordinates));
    for(var t in this.tiles){
      var tile = this.tiles[t]
      tile.visible = true;
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
    for(let t in this.tiles){
      let tile = this.tiles[t]
      tile.highlight = tile.monster = tile.green = tile.red = tile.crown = tile.door =
      tile.key = tile.disguise = tile.lantern = tile.stairs = tile.void = tile.title1 =
      tile.title2 = tile.title3 = tile.title4 = tile.title5 = tile.title6 = tile.title7 =
      tile.title8 = tile.title9 = tile.title10 = false;
      tile.contains = null;
    }
  }
  clickTile(target){
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
    for(let i = 0; i < this.tiles.length; i++){
      let tile = this.tiles[i]
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
      if(this.tiles[leftPoint]) this.tiles[leftPoint].green = true;
      if(this.tiles[rightPoint]) this.tiles[rightPoint].green = true;
      if(this.tiles[upperPoint]) this.tiles[upperPoint].green = true;
      if(this.tiles[lowerPoint]) this.tiles[lowerPoint].green = true;
      if(this.tiles[upperLeftPoint]) this.tiles[upperLeftPoint].green = true;
      if(this.tiles[upperRightPoint]) this.tiles[upperRightPoint].green = true;
      if(this.tiles[lowerLeftPoint]) this.tiles[lowerLeftPoint].green = true;
      if(this.tiles[lowerRightPoint]) this.tiles[lowerRightPoint].green = true;
      
    }
  }
  coordinatePoint(coordinates){
    return coordinates[1]*this.rowLength + coordinates[0]
  };

  whatsAdjacent(coords, radius = 1) {

    //NEED TO ACCOUNT FOR WRAP AROUND

    let adjacentItems = [];
    let checkCoords = function(coords, diagonal = ''){
      let tile = this.tiles[this.coordinatePoint(coords)]
      if(!tile) return
      if(diagonal === 'ul' && this.tiles[tile.id+1] && this.tiles[tile.id+1].void && this.tiles[tile.id+15].void) return
      if (diagonal === 'ur' && this.tiles[tile.id-1] && this.tiles[tile.id-1].void && this.tiles[tile.id+15] && this.tiles[tile.id+15].void) return
      if (diagonal === 'll' && this.tiles[tile.id+1] && this.tiles[tile.id+1].void && this.tiles[tile.id-15] && this.tiles[tile.id-15].void) return
      if (diagonal === 'lr' && this.tiles[tile.id-1] && this.tiles[tile.id-1].void && this.tiles[tile.id-15].void) return

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
