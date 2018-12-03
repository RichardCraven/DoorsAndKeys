import { Component, OnInit, HostListener } from '@angular/core';
import {TileComponent} from '../tile/tile.component'
import {PlayerManagerService} from '../services/player-manager.service'
import { Subscription, Observable, interval, timer } from 'rxjs';
import { ViewChild, ElementRef } from '@angular/core';
// import {InfoPanelComponent} from '../info-panel/info-panel.component'
@Component({
  selector: 'main-board',
  templateUrl: './main-board.component.html',
  styleUrls: ['./main-board.component.css']
})
export class MainBoardComponent implements OnInit {
  newPlayerSubscription: Subscription;
  introVideo = true;
  totalTiles = 225;
  rowLength = 15;
  idCount = 0;
  floatingCounter = 0;
  stopTimer = false;
  turnStarted = false;
  canvas;
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
  public context: CanvasRenderingContext2D;


  constructor(public playerManager: PlayerManagerService) { }

  ngOnInit() {
    var DOMboard = document.querySelector('.board')
    // this.canvas = document.getElementById('myCanvas');
    this.context = (<HTMLCanvasElement>this.myCanvas.nativeElement).getContext('2d');
    this.context.scale(16,16);
    // this.context = this.canvas.getContext('2d');
    for (let i = 0; i<this.totalTiles; i++){
      var tile = {
        id : this.idCount,
        empty: true,
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
        title1: false,
        title2: false,
        title3: false
      }
      this.tiles.push(tile)
      this.idCount++
    }
    this.populateBoard();
    this.assignEdges();

    //DEFINING EDGES, NEED TO CHANGE THIS IF YOU CHANGE BOARD SIZE
    
    this.playerManager.getPlayerActivity(this.tiles).subscribe(res => {
      this.handlePlayerServiceSubscription(res)
    })

    if(this.introVideo){
      this.tiles[112].occupied = true;
      this.tiles[112].empty = false;
      const fade1 = timer(1000);
      const fade2 = timer(2500);
      const fade3 = timer(3500);
      const fade4 = timer(4750);
      const fade5 = timer(5000);
      const fade6 = timer(7250);
      const fade7 = timer(19250);
      const fade8 = timer(19250);
      const fade1Sub = fade1.subscribe( res => {
        console.log('fade 1');
        for(var t in this.tiles){
          var tile = this.tiles[t]
          tile.green = false;
          tile.visible = true;
        }
      })
      const fade2Sub = fade2.subscribe(val => {
        console.log('fade 2');
        this.buildVoid()
      });
      const fade3Sub = fade3.subscribe( res => {
        const visibility = this.playerManager.checkVisibility(112, 2)
        console.log('fade 3');
        for(var t in this.tiles){
          var tile = this.tiles[t]
          tile.visible = false;
          if(visibility.indexOf(tile.id) > -1){
            tile.visible = true;
            tile.void = false;
          } 
          this.paintMoveZone([7,7])
          
        }
        // this.playerManager.newPlayer()
      })
      const fade4Sub = fade4.subscribe( res => {
        console.log('fade 4');
         const tiles = this.tiles
         for(let i = 35; i <= 39; i++){
           this.clearTile(tiles[i])
           tiles[i].visible = true;
           tiles[i].void = false;
         }
        const door1 = timer(200);
        const door2 = timer(400);
        const door3 = timer(600);
        const door4 = timer(800);
        const door5 = timer(1000);
        door1.subscribe(res => {
          tiles[35].title1 = true;
        })
        door2.subscribe(res => {
          tiles[36].title2 = true;
        })
        door3.subscribe(res => {
          tiles[37].title3 = true;
        })
        door4.subscribe(res => {
          tiles[38].title4 = true;
        })
        door5.subscribe(res => {
          tiles[39].title5 = true;
        })

         
         
        
      })
      const fade5Sub = fade5.subscribe( res => {
        console.log('fade 5');
        
        const voids = [33, 50, 52, 22, 9]
        for(let i = 0; i< voids.length; i++){
          if(this.tiles[voids[i]]) this.tiles[voids[i]].void = true;
        }
        this.playerManager.newPlayer(35)
        const move1 = timer(500);
        const move2 = timer(1000);
        const move3 = timer(1500);
        const move4 = timer(2000);
        move1.subscribe(res => {
          this.playerManager.movePlayer('right')
        })
        move2.subscribe(res => {
          this.playerManager.movePlayer('right')
        })
        move3.subscribe(res => {
          this.playerManager.movePlayer('right')
        })
        move4.subscribe(res => {
          this.playerManager.movePlayer('right')
        })
      })
      const fade6Sub = fade6.subscribe( res => {
        
        
        
        
        const keys1 = timer(200);
        const keys2 = timer(500);
        const keys3 = timer(600);
        const keys4 = timer(800);
        keys1.subscribe(res => {
          this.tiles[51].title6 = true;
        })
        keys2.subscribe(res => {
          this.tiles[52].title7 = true;
        })
        keys3.subscribe(res => {
          this.tiles[53].title8 = true;
        })
        keys4.subscribe(res => {
          this.tiles[54].title9 = true;
        })
      })
      const fade7Sub = fade6.subscribe( res => {
        console.log('fade 6');
        this.tiles[112].occupied = false;
        var arr = [0,14, 210, 224]
        const empties = []
        for(let i = 0; i< arr.length; i++){
          if(this.tiles[arr[i]].empty) empties.push(arr[i])
        }
        var num = Math.floor(Math.random() * empties.length)
        this.playerManager.newPlayer(empties[num])
      })
    } else {
      // this.playerManager.newPlayer()
    }
  }
  populateBoard(){

    this.resetInventory()
    this.resetTiles()

    for(let i = 0; i <this.items.length; i++){
      while(this.boardInventory[this.items[i]] > 0){
        let num = Math.floor(Math.random() * this.tiles.length)
        let tile = this.tiles[num]
        if(tile.empty){
          tile.contains = this.items[i]
          tile[this.items[i]] = true;
          tile.empty = false;
          this.boardInventory[this.items[i]]--
        } 
      }
    }
  }
  buildVoid(){
    const tiles = this.tiles;
    for(let t in tiles){
      if(tiles[t].empty){
        let num = Math.random()
        // console.log('num:',num);
        
        if(num >0.75){
          // console.log('void');
          tiles[t].empty = false;
          tiles[t].void = true;
        }
      }
    }
  }
  buildWalls(){

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
    const tile = this.tiles[res.location]
      if(!res.startTurn){
        for(var t in this.tiles){
          this.tiles[t].visible = false
        }
      }
      tile.empty = false;
      tile.visible = true;
      tile.occupied = true;
      if(res.old_location || res.old_location === 0){
        const old_tile = this.tiles[res.old_location]
        old_tile.empty = true;
        old_tile.visible = false;
        old_tile.occupied = false;
      }
      if(res.startTurn){
        this.startTurn()
        const fade1 = timer(500);
        const fade2 = timer(1500);
        const fade1Sub = fade1.subscribe( res => {
          console.log('fade 1');
          for(var t in this.tiles){
            var tile = this.tiles[t]
            tile.green = false;
            tile.visible = true;
          }
          
        })
        const fade2Sub = fade2.subscribe(val => {
          for(var t in this.tiles){
            var tile = this.tiles[t]
            tile.visible = false
          }
          if(res.visibility){
            for(let v = 0; v < res.visibility.length; v++){
              if(this.tiles[res.visibility[v]]) this.tiles[res.visibility[v]].visible = true;
            }
          }
          this.paintMoveZone()
        });
        for(let v = 0; v < res.visibility.length; v++){
          if(this.tiles[res.visibility[v]]) this.tiles[res.visibility[v]].visible = true;
        }
      }
      for(let i = 0; i < this.tiles.length; i++){
        let tile = this.tiles[i]
        tile.visible = false;
      }
      if(res.visibility){
        for(let v = 0; v < res.visibility.length; v++){
          if(this.tiles[res.visibility[v]]) this.tiles[res.visibility[v]].visible = true;
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
    this.whichSide(this.playerManager.activePlayer.location)
    for(var t in this.tiles){
      var tile = this.tiles[t]
      tile.visible = false
    }
  }
  onEnterKey($event){
    // console.log('WAYOOO, event is ', $event);
  }
  isEmpty(target){
    // console.log('empty: ',target.empty);
  }
  clearTile(tile){
    tile.monster = tile.green = tile.red = tile.occupied = tile.crown = tile.door =
    tile.key = tile.disguise = tile.lantern = tile.stairs = false;
    tile.empty = true;
  }
  resetTiles(){
    for(let t in this.tiles){
      let tile = this.tiles[t]
      tile.monster = tile.green = tile.red = tile.occupied = tile.crown = tile.door =
      tile.key = tile.disguise = tile.lantern = tile.stairs = tile.void = false;
      tile.empty = true;
    }
  }
  isId(target){
    // console.log('id: ',target.coordinates);
    console.log(target);
    
    // this.checkDistance(target.coordinates, this.pointToCoordinates(this.playerManager.activePlayer.location))
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
  whichSide(location){
    const coordinates = this.pointToCoordinates(location)
    // console.log('which side? ', coordinates)
    if(true){
      // console.log('LEFT SAIDE!')
    } else {
      // console.log('RIGHT SIIIDE')
    }
    this.playerManager.activePlayer.coordinates = coordinates;
    
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
      // console.log(coords[0]-3)
      // console.log(coords[0]-3)
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
  }
}
