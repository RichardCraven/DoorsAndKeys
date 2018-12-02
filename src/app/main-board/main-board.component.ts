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
    console.log('this.myCanvas is ', this.myCanvas);
    
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
        visible: true,
        monster: false,
        edge: false,
        green: false,
        red: false,
        darkness: false,
        coordinates: []
      }
      this.tiles.push(tile)
      this.idCount++
    }
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

    //DEFINING EDGES, NEED TO CHANGE THIS IF YOU CHANGE BOARD SIZE
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
    this.playerManager.getPlayerActivity(this.tiles).subscribe(res => {
      const tile = this.tiles[res.location]
      if(!res.startTurn){
        for(var t in this.tiles){
          var newTile = this.tiles[t]
          tile.visible = false
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
        // return
        this.startTurn()
        // let timer = interval(1500)
        // .subscribe(i => { 
        //   this.floatingCounter++
        //   console.log(this.floatingCounter);
        //   if(this.floatingCounter >5){
        //     this.floatingCounter = 0;
        //     timer.unsubscribe()
        //   }
        // })
        for(let v = 0; v < res.visibility.length; v++){
          if(this.tiles[res.visibility[v]]) this.tiles[res.visibility[v]].visible = true;
        }
        const source = timer(1000);
        const subscribe = source.subscribe(val => {
          
          this.paintMoveZone()
        });
      }
      if(res.visibility && !res.startTurn){
        console.log('check vis')
        for(let v = 0; v < res.visibility.length; v++){
          if(this.tiles[res.visibility[v]]) this.tiles[res.visibility[v]].visible = true;
        }
      }
      
    })
    // this.infoPanel.getButtonPresses().subscribe(res => {
    //   console.log('res is ', res);
      
    // })
    this.playerManager.newPlayer()

    const crownAbsent = false;
  }
  startTurn(){
    console.log('starting turn', this.turnStarted)
    this.turnStarted = true;
    this.whichSide(this.playerManager.activePlayer.location)
    for(var t in this.tiles){
      var tile = this.tiles[t]
      tile.visible = false
    }
    // console.log('starting turn for ', this.playerManager.activePlayer)
    // this.infoPanel.displayMessage('Turn started', 'general')

  }
  onEnterKey($event){
    // console.log('WAYOOO, event is ', $event);
  }
  isEmpty(target){
    // console.log('empty: ',target.empty);
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
  paintMoveZone(){
    const coords = this.playerManager.activePlayer.coordinates
    
    const moves = this.playerManager.activePlayer.moves
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
