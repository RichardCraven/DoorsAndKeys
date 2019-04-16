import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CollisionManagerService {
  private collisionSubject = new Subject<any>();
  public playerHit = false;
  private playerX;
  private playerY;
  public monsterX;
  public monsterY;
  public midGateX = 0;
  public midGateY;

  constructor() { }
  updatePlayerPosition(x, y){
    this.playerX = x;
    this.playerY = y;
  }
  updateMonsterPosition(x, y){
    this.monsterX = x;
    this.monsterY = y;
  }
  checkMonsterCollision(x,y){
    if(this.monsterX && Math.abs(x - this.monsterX) < 100 && Math.abs(y - this.monsterY) < 100){
      return true
    } else {
      return false
    }
  }
  checkForGate(direction){
    if(direction === 'up'){
      if(this.playerY === 600 && this.playerX > this.midGateX){
        return false
      }
    } else if(direction === 'down'){
      if(this.playerY === 300 && this.playerX > this.midGateX){
        return false
      }
    }
    return true
  }
  checkCollision(x, y, iconHeight){
    if(Math.abs(x - this.playerX) < iconHeight && Math.abs(y - this.playerY) < iconHeight){
      // console.log('COLLISION-- player xy: ', this.playerX, this.playerY, ' projectile xy: ', x,y, iconHeight);
      this.collisionSubject.next({y_value : y})
      // return true;
    } else {
      return false;
    }
  }
  updateProjectilePosition(x, y, iconHeight){
    if(Math.abs(x - this.playerX) < iconHeight && Math.abs(y - this.playerY) < iconHeight && this.playerY < 810){
      
      this.collisionSubject.next({y_value : y})
      // console.log('COLLISION, y is ', y);
      // if(!this.playerHit){
      //   console.log('COLLISION, y is ', y);
      //   this.playerHit = true;
      //   this.collisionSubject.next({y_value : y})
      // }
      return true
    } else {
      return false
    }
  }
  detectCollision(): Observable<any>{
    return this.collisionSubject.asObservable()
  }
  pushBackAvatar(projectileY_value){

  }
  // sendDataToAvatar(): Observable<any>{
  //   return this.collisionSubject.asObservable()
  // }
}
