import { Injectable, OnInit, HostListener } from '@angular/core';
import {Observable, Subject} from 'rxjs';
import { Logs } from 'selenium-webdriver';

// export enum KEY_CODE {
//   RIGHT_ARROW = 39,
//   LEFT_ARROW = 37
// }

@Injectable({
  providedIn: 'root'
})
// @HostListener('keyup', ['$event'])
//   keyEvent(event: KeyboardEvent) {
//     console.log(event);
    
//     if (event.keyCode === KEY_CODE.RIGHT_ARROW) {
//       // this.increment();
//       console.log('right')
//     }

//     if (event.keyCode === KEY_CODE.LEFT_ARROW) {
//       // this.decrement();
//       console.log('left')
//     }
//   }
export class PlayerManagerService {
  private subject = new Subject<any>();
  public currentMap;
  public counter = 1;
  public empties = [];
  public players = [];
  private activePlayer;

  // @HostListener('window:keydown', ['$event'])
  // keyEvent(event: KeyboardEvent) { 
  //   console.log('service',event.key);
    
  // }
  
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
      }
      // this.movePlayer('up')
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
    // console.log('new player', map);
    // this.subject.next({ msg: map});
    return this.subject.asObservable()
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
      location: location
    }
    this.activePlayer = newPlayer;
    this.subject.next({ location: location});
  }
  movePlayer(direction){
    const old_location = this.currentMap[this.activePlayer.location]
    let destination;
    // console.log('direction is ', direction);
    // this.subject.next({location: })
    // console.log('current map: ', this.currentMap);
    
    // console.log('OLD LOCATION IS ', old_location.id);
    
    
    // if(this.currentMap)
    switch (direction){
      case 'left':
      // console.log(old_location.id);
      
      if(old_location.id === 210 || old_location.id === 0) return
      // console.log('old_location edge is ', old_location.edge);
      
      destination = this.currentMap[this.activePlayer.location-1]
      // console.log('left destination is ', destination.edge);

      if(!destination || old_location.id === 0 || old_location.id === 210 || destination.edge === 'right') return


      // if(!destination || destination.edge && old_location.edge && destination.edge !== old_location.edge) return
      if(destination.empty) this.activePlayer.location = this.activePlayer.location-1
      break
      case 'right':
      // console.log(old_location.id);
      destination = this.currentMap[this.activePlayer.location+1]
      // console.log('dest edge is ', destination.edge);
      
      if(!destination || old_location.id === 14 || old_location.id === 224 || destination.edge === 'left') return
      // if(old_location.id === 210 || destination.id === 211 && destination.empty) this.activePlayer.location = this.activePlayer.location+1
      

      // console.log('destination edge is ', destination.edge);
      // console.log('old_location edge is ', old_location.edge);
      
      
      // if(!destination || destination.edge && old_location.edge && destination.edge !== old_location.edge || old_location.id !== 210) return
      if(destination.empty) this.activePlayer.location = this.activePlayer.location+1
      break
      case 'up':
      // console.log(old_location.id);
      if(old_location.id === 0 || old_location.id === 14) return
      destination = this.currentMap[this.activePlayer.location-15]
      if(!destination || destination.edge && old_location.edge && destination.edge !== old_location.edge) return
      if(destination.empty) this.activePlayer.location = this.activePlayer.location-15
      break
      case 'down':
      // console.log(old_location.id);
      destination = this.currentMap[this.activePlayer.location+15]
      if(old_location.id === 210 || old_location.id === 224) return
      if(!destination || destination.edge && old_location.edge && destination.edge !== old_location.edge) return
      if(destination.empty) this.activePlayer.location = this.activePlayer.location+15
      break
    }
    // console.log(this.currentMap[this.activePlayer.location].empty);
    
    if(this.currentMap[this.activePlayer.location].empty){
      this.subject.next({ location: this.activePlayer.location, old_location : old_location.id});
    } else {
      console.log('seats taken!');
      
    }
    
  }
  
}
