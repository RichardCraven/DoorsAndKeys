import { Injectable, OnInit, HostListener } from '@angular/core';
import {Observable, Subject} from 'rxjs';
import { Logs } from 'selenium-webdriver';

@Injectable({
  providedIn: 'root'
})
export class PlayerManagerService {
  private subject = new Subject<any>();
  private messageSubject = new Subject<any>();
  public currentMap;
  public counter = 1;
  public empties = [];
  public players = [];
  public activePlayer;
  constructor() {
    window.addEventListener('keydown', (event) => {
      // console.log(event.key);
      
      switch(event.key){
        case 'ArrowUp':
          this.movePlayer('up')
        break
        case 'ArrowDown':
          this.movePlayer('down')
        break
        case 'ArrowLeft':
          this.movePlayer('left')
        break
        case 'ArrowRight':
          this.movePlayer('right')
        break
        case 'Enter':
          this.startTurn();
        break
      }
    });
  }
  

  ping(){
    console.log('pinged')
  }
  onInit(){
    console.log('service initted');
    
  }
  // Observable<any>
  getPlayerActivity(map): Observable<any>{
    this.currentMap = map;
    return this.subject.asObservable()
  }
  getPlayerMessages(): Observable<any>{
    return this.messageSubject.asObservable()
  }
  newPlayer(){
    const map = this.currentMap;
    for(let a in map){
      if(map[a].empty){
        this.empties.push(map[a].id)
      }
    }
    var num = Math.floor(Math.random() * this.empties.length) 
    const location = this.empties[num];
    const newPlayer = {
      name: 'player'+this.counter,
      location: location,
      visibility: 2,
      moves: 2,
      coordinates: [0,0]
    }
    this.activePlayer = newPlayer;

    const visible = this.checkVisibility(this.activePlayer.location, this.activePlayer.visibility)
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
    this.messageSubject.next({msg : 'moving '+direction});
    const old_location = this.currentMap[this.activePlayer.location]
    let destination;
    switch (direction){
      case 'left':
      if(old_location.id === 210 || old_location.id === 0) return
      destination = this.currentMap[this.activePlayer.location-1]
      if(!destination || old_location.id === 0 || old_location.id === 210 || destination.edge === 'right') return
      if(destination.empty) this.activePlayer.location = this.activePlayer.location-1
      break
      case 'right':
      destination = this.currentMap[this.activePlayer.location+1]
      if(!destination || old_location.id === 14 || old_location.id === 224 || destination.edge === 'left') return
      if(destination.empty) this.activePlayer.location = this.activePlayer.location+1
      break
      case 'up':
      if(old_location.id === 0 || old_location.id === 14) return
      destination = this.currentMap[this.activePlayer.location-15]
      if(!destination || destination.edge && old_location.edge && destination.edge !== old_location.edge) return
      if(destination.empty) this.activePlayer.location = this.activePlayer.location-15
      break
      case 'down':
      destination = this.currentMap[this.activePlayer.location+15]
      if(old_location.id === 210 || old_location.id === 224) return
      if(!destination || destination.edge && old_location.edge && destination.edge !== old_location.edge) return
      if(destination.empty) this.activePlayer.location = this.activePlayer.location+15
      break
    }
    if(this.currentMap[this.activePlayer.location].empty){
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
      console.log('tests passed, at left edge');
      if(location !== 212){
        hidden.push(location-2)
      }
    }
    if(map[location+1] && map[location+1].edge && map[location+2] && map[location+2].edge && map[location+1].edge !== map[location+2].edge){
      hidden.push(location+2)
    }
    for(var t = 0; t <= visibility; t++){
      if(map[location-t] && hidden.indexOf(location-t) === -1){ 
        visible.push(map[location-t].id)
      }
      if(map[location+t] && hidden.indexOf(location+t) === -1){ 
        visible.push(map[location+t].id)
      }
      if(map[location-15*t] && hidden.indexOf(location-15*t) === -1 ) {
        visible.push(map[(location-15*t)].id)
      }
      if(map[location+15*t] && hidden.indexOf(location+15*t) === -1) {
        visible.push(map[(location+15*t)].id)
      }
      if(t === 1){
        if(map[location-16] && hidden.indexOf(location-16) === -1) {visible.push(map[(location-16)].id)}
        if(map[location-14] && hidden.indexOf(location-14) === -1 && location !== 224) {visible.push(map[(location-14)].id)}
        if(map[location+14] && hidden.indexOf(location+14) === -1 && location !== 0) {visible.push(map[(location+14)].id)}
        if(map[location+16] && hidden.indexOf(location+16) === -1) {visible.push(map[(location+16)].id)}
      }
    }
    return visible;
  }
}
