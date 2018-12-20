import { Injectable, HostListener } from '@angular/core';
import {Observable, Subject} from 'rxjs';
import { Logs } from 'selenium-webdriver';

@Injectable({
  providedIn: 'root'
})
export class PlayerManagerService{
  private subject = new Subject<any>();
  public messageSubject = new Subject<any>();
  public currentMap;
  public counter = 1;
  public empties = [];
  public players = [];
  public activePlayer;
  constructor() {
    // window.addEventListener('keydown', (event) => {
    //   switch(event.key){
    //     case 'ArrowUp':
    //       this.movePlayer('up')
    //     break
    //     case 'ArrowDown':
    //       this.movePlayer('down')
    //     break
    //     case 'ArrowLeft':
    //       this.movePlayer('left')
    //     break
    //     case 'ArrowRight':
    //       this.movePlayer('right')
    //     break
    //     case 'Enter':
    //       this.startTurn();
    //     break
    //   }
    // });
    
    const newPlayer = {
      name: 'player1',
      inventory: {
        weapon: {
         type: 'flail',
         attack: 3,
         damage: 2
        }
      },
      location: null,
      visibility: 2,
      moves: 2,
      coordinates: [0,0]
    }
    this.activePlayer = newPlayer;
  }
  
  initiateCombat(){
    console.log('about to remove from playerService');
    
    // window.removeEventListener('keydown', (event) => {
    //   console.log('removing window.event listener');
      
    // });
  }
  ping(){
  }
  // Observable<any>
  getPlayerActivity(tileMap): Observable<any>{
    this.currentMap = tileMap;
    return this.subject.asObservable()
  }
  getPlayerMessages(): Observable<any>{
    return this.messageSubject.asObservable()
  }
  newPlayer(location){
    
    const map = this.currentMap;
    // for(let a in map){
      //   if(map[a].empty){
        //     this.empties.push(map[a].id)
        //   }
        // }
        // this.empties = [0, 14, 210,224]
        // for(let a )
        // var num = Math.floor(Math.random() * this.empties.length) 
        // const location = this.empties[num];
        const newPlayer = {
          name: 'player'+this.counter,
          inventory: {
            weapon: 'flail'
          },
          location: location,
          visibility: 2,
          moves: 2,
          coordinates: [0,0]
        }
        this.activePlayer = newPlayer;
        
        const visible = this.checkVisibility(this.activePlayer.location, this.activePlayer.visibility);
    this.subject.next({location, visibility: visible});
  }
  startTurn(){
    const player = this.activePlayer;
    const location = player.location;
    const visible = this.checkVisibility(player.location, player.visibility)
    this.subject.next({location, visibility: visible, startTurn : true});
    // let leftOrRight = this.leftOrRight(player.location)
  }
  leftOrRight(location){
    return 'left'
  }
  movePlayer(direction){
    if(!this.activePlayer) return
    this.messageSubject.next({msg : 'moving '+direction});
    const old_location = this.currentMap[this.activePlayer.location]
    let destination;
    switch (direction){
      case 'left':
      if(old_location.id === 210 || old_location.id === 0) return
      destination = this.currentMap[this.activePlayer.location-1]
      if(!destination || old_location.id === 0 || old_location.id === 210 || destination.edge === 'right' || destination.void) return
      if(!destination.contains) this.activePlayer.location = this.activePlayer.location-1
      break
      case 'right':
      destination = this.currentMap[this.activePlayer.location+1]
      if(!destination || old_location.id === 14 || old_location.id === 224 || destination.edge === 'left' || destination.void) return
      if(!destination.contains) this.activePlayer.location = this.activePlayer.location+1
      break
      case 'up':
      if(old_location.id === 0 || old_location.id === 14) return
      destination = this.currentMap[this.activePlayer.location-15]
      if(!destination || destination.edge && old_location.edge && destination.edge !== old_location.edge || destination.void) return
      if(!destination.contains) this.activePlayer.location = this.activePlayer.location-15
      break
      case 'down':
      destination = this.currentMap[this.activePlayer.location+15]
      if(old_location.id === 210 || old_location.id === 224) return
      if(!destination || destination.edge && old_location.edge && destination.edge !== old_location.edge || destination.void) return
      if(!destination.contains) this.activePlayer.location = this.activePlayer.location+15
      break
    }
    if(!this.currentMap[this.activePlayer.location].contains){
      const visible = this.checkVisibility(this.activePlayer.location, this.activePlayer.visibility)
      this.subject.next({location: this.activePlayer.location, old_location : old_location.id, visibility: visible});
    }     
  }
  checkVisibility(location, visibility){
    const visible = [];
    const hidden = [];
    visible.push(location)
    const map = this.currentMap;
    let curEdge;

    //edge cases :P
    if(map[location].edge){ 
      curEdge = map[location].edge;
    }
    if(curEdge && curEdge ==='left' && map[location-1] && map[location-1].edge && curEdge !== map[location-1].edge){ 
      if(map[location-1]) {hidden.push(location-1) }
      if(map[location-2]) {hidden.push(location-2) }
      if(map[location+14]) {hidden.push(location+14)}
      if(map[location-16]) {hidden.push(location-16)}
    }
    if(curEdge && curEdge ==='right' && map[location+1] && map[location+1].edge && curEdge !== map[location+1].edge){ 
      if(map[location+1]) {hidden.push(location+1) }
      if(map[location+2]) {hidden.push(location+2) }
      if(map[location+16]) {hidden.push(location+16)}
      if(map[location-14]) {hidden.push(location-14)}
    }
    //second from edge
    if(map[location-1] && map[location-1].edge && map[location-2] && map[location-2].edge && map[location-1].edge !== map[location-2].edge){ 
      if(location !== 212){
        hidden.push(location-2)
      }
    }
    if(map[location+1] && map[location+1].edge && map[location+2] && map[location+2].edge && map[location+1].edge !== map[location+2].edge){
      hidden.push(location+2)
    }
    
    for(var t = 1; t <= visibility; t++){
      if(map[location-t] && hidden.indexOf(location-t) === -1 && !map[(location-t)+1].void){ 
        visible.push(map[location-t].id)
        //should be able to just push the number and not the id
      }
      if(map[location+t] && hidden.indexOf(location+t) === -1 && !map[(location+t)-1].void){ 
        visible.push(map[location+t].id)
      }
      if(map[location-15*t] && hidden.indexOf(location-15*t) === -1 && !map[(location-15*t)+15].void ) {
        visible.push(map[(location-15*t)].id)
      }
      if(map[location+15*t] && hidden.indexOf(location+15*t) === -1 && !map[(location+15*t)-15].void) {
        visible.push(map[(location+15*t)].id)
      }
      if(t === 1){
        //this is where it checks if the square is hidden (edge wrap) or if it's obscured by TWO voids (so you can't see through cracks)
        if(map[location-16] && hidden.indexOf(location-16) === -1 && !map[location-15].void && !map[location-1].void) {visible.push(map[(location-16)].id)}
        if(map[location-14] && hidden.indexOf(location-14) === -1 && location !== 224 && (!map[location-15].void || !map[location+1].void)) {visible.push(map[(location-14)].id)}
        if(map[location+14] && hidden.indexOf(location+14) === -1 && location !== 0 && (!map[location+15].void || !map[location-1].void)) {visible.push(map[(location+14)].id)}
        if(map[location+16] && hidden.indexOf(location+16) === -1 && !map[location+15].void && !map[location+1].void) {visible.push(map[(location+16)].id)}
      }
    }
    return visible;
  }
}
