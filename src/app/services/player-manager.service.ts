import { Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import { ItemsService } from './items.service';

@Injectable({
  providedIn: 'root'
})
export class PlayerManagerService{
  private subject = new Subject<any>();
  public messageSubject = new Subject<any>();
  public itemRequestSubject = new Subject<any>();
  public globalSubject = new Subject<any>();
  public attackPing = new Subject<any>();
  public movementLocked : boolean = false;
  public currentMap;
  public counter = 1;
  public empties = [];
  public players = [];
  public activePlayer;
  public inCombat = false;
  constructor(public itemsService: ItemsService) {
    window.addEventListener("focus", (event) => {
    }, false);

    window.addEventListener('keydown', (event) => {
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
      }, true);

    window.focus();
    const weaponsArr = ['sword', 'axe', 'flail', 'spear', 'scepter'];
    const weapon = weaponsArr[Math.floor(Math.random()* weaponsArr.length)];
    const charmsArr = ['beetle_charm', 'demonskull_charm','evilai_charm','hamsa_charm','lundi_charm','nukta_charm','scarab_charm'];
    const charm = charmsArr[Math.floor(Math.random()* weaponsArr.length)];
    const wandsArr = ['maerlyns_rod', 'glindas_wand', 'vardas_wand'];
    const wand = wandsArr[Math.floor(Math.random()* wandsArr.length)];
    const headgearArr = ['bundu_mask', 'court_mask', 'lundi_mask', 'mardi_mask', 'solomon_mask', 'zul_mask', 'helmet'];
    const headgear = headgearArr[Math.floor(Math.random()* headgearArr.length)];
    const amuletsArr = ['sayan_amulet','lundi_amulet','evilai_amulet','nukta_amulet',]
    const amulet = amuletsArr[Math.floor(Math.random()* amuletsArr.length)];
    const shieldsArr = ['seeing_shield','basic_shield'];
    const shield = shieldsArr[Math.floor(Math.random()* shieldsArr.length)];
  }
  handleKeydown(event){
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
  }
  initiateCombat(){
    this.inCombat = true;
  }
  requestItem(item){
    if(item === 'clear'){
      this.itemRequestSubject.next({clear : true})
    }else {
      this.itemRequestSubject.next({item})
    }
  }
  endCombat(whoDied = null){
    if(whoDied === 'playerDead'){
      this.subject.next({endCombat : true, playerDied : true})
    } else if(whoDied === 'monsterDead') {
      this.subject.next({endCombat : true, monsterDied : true})
    }
    this.inCombat = false;
  }
  gainItem(item){
    for(let itemArr in this.itemsService.library){
      for(let itemInstance in this.itemsService.library[itemArr]){
        if(item === this.itemsService.library[itemArr][itemInstance].type){
          // this .activePlayer.inventory[itemArr].push(this.itemsService.library[itemArr][itemInstance])
        }
      }
    }
    this.globalSubject.next({update: true})
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
  getItem(): Observable<any>{
    return this.itemRequestSubject.asObservable()
  }
  getGlobalMessages(): Observable<any>{
    return this.globalSubject.asObservable()
  }
  getAttackNotification(): Observable<any>{
    return this.attackPing.asObservable()
  }
  newPlayer(location){
    
    const map = this.currentMap;
    const weaponsArr = ['sword', 'axe', 'flail', 'spear'];
    const weapon = weaponsArr[Math.floor(Math.random()* weaponsArr.length)];
    // const weapon = 'scepter'

    // !TODO scepter was removed

    const charmsArr = ['beetle_charm', 'demonskull_charm','evilai_charm','hamsa_charm','lundi_charm','nukta_charm','scarab_charm'];
    const charm = charmsArr[Math.floor(Math.random()* weaponsArr.length)];
    const wandsArr = ['maerlyns_rod', 'glindas_wand', 'vardas_wand'];
    const wand = wandsArr[Math.floor(Math.random()* wandsArr.length)];
    const headgearArr = ['bundu_mask', 'court_mask', 'lundi_mask', 'mardi_mask', 'solomon_mask', 'zul_mask', 'helmet'];
    const headgear = headgearArr[Math.floor(Math.random()* headgearArr.length)];
    const amuletsArr = ['sayan_amulet','lundi_amulet','evilai_amulet','nukta_amulet',]
    const amulet = amuletsArr[Math.floor(Math.random()* amuletsArr.length)];
    const shieldsArr = ['seeing_shield','basic_shield'];
    const shield = shieldsArr[Math.floor(Math.random()* shieldsArr.length)];

    const newPlayer = {
      name: 'player1',
      inventory: {
        weapons: [
          this.itemsService.library.weapons[weapon]
        ],
        amulets: [],
        headgear: [],
        wands: [
          this.itemsService.library.wands[wand]
        ],
        shields: [],
        misc: [],
        charms: [],
      },
      location: location,
      visibility: 2,
      moves: 2,
      coordinates: [0,0]
    }

    if(Math.random()) newPlayer.inventory.headgear.push(this.itemsService.library.headgear[headgear])
    if(Math.random()) newPlayer.inventory.amulets.push(this.itemsService.library.amulets[amulet])
    if(Math.random()) newPlayer.inventory.shields.push(this.itemsService.library.shields[shield])
    this.activePlayer = newPlayer;
    const visible = this.checkVisibility(this.activePlayer.location, this.activePlayer.visibility);
    this.subject.next({location, visibility: visible});
  }

  startTurn(){
    const player = this.activePlayer;
    const location = player.location;
    const visible = this.checkVisibility(player.location, player.visibility)
    this.subject.next({location, visibility: visible, startTurn : true});
  }

  leftOrRight(location){
    return 'left'
  }

  movePlayer(direction){
    if(!this.activePlayer || !this.activePlayer.location || this.inCombat || this.movementLocked) return
    this.messageSubject.next({msg : 'moving '+direction});
    const old_location = this.currentMap[this.activePlayer.location]
    let destination;
    switch (direction){
      case 'left':
      if(old_location.id === 210 || old_location.id === 0) return
      destination = this.currentMap[this.activePlayer.location-1]
      if(!destination || old_location.id === 0 || old_location.id === 210 || destination.edge === 'right' || destination.void) return
      if(!destination.contains) this.activePlayer.location = this.activePlayer.location-1
      if(destination.monster) this.subject.next({monster: destination})
      if(destination.item) this.subject.next({item: destination})
      break
      case 'right':
      destination = this.currentMap[this.activePlayer.location+1]
      if(!destination || old_location.id === 14 || old_location.id === 224 || destination.edge === 'left' || destination.void) return
      if(!destination.contains) this.activePlayer.location = this.activePlayer.location+1
      if(destination.monster) this.subject.next({monster: destination})
      if(destination.item) this.subject.next({item: destination})
      break
      case 'up':
      if(old_location.id === 0 || old_location.id === 14) return
      destination = this.currentMap[this.activePlayer.location-15]
      if(!destination || destination.edge && old_location.edge && destination.edge !== old_location.edge || destination.void) return
      if(!destination.contains) this.activePlayer.location = this.activePlayer.location-15
      if(destination.monster) this.subject.next({monster: destination})
      if(destination.item) this.subject.next({item: destination})
      break
      case 'down':
      destination = this.currentMap[this.activePlayer.location+15]
      if(old_location.id === 210 || old_location.id === 224) return
      if(!destination || destination.edge && old_location.edge && destination.edge !== old_location.edge || destination.void) return
      if(!destination.contains) this.activePlayer.location = this.activePlayer.location+15
      if(destination.monster) this.subject.next({monster: destination})
      if(destination.item) this.subject.next({item: destination})
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
