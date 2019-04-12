import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CollisionManagerService {
  private subject = new Subject<any>();
  public playerHit = false;
  private playerX;
  private playerY;
  public monsterX;
  public monsterY;

  constructor() { }
  updatePlayerPosition(x, y){
    this.playerX = x;
    this.playerY = y;
  }
  updateMonsterPosition(x, y){
    console.log('monster is at ', x,y)
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
  updateProjectilePosition(x, y, iconHeight){
    if(Math.abs(x - this.playerX) < iconHeight && Math.abs(y - this.playerY) < iconHeight){
      if(!this.playerHit){
        console.log('COLLISION');
        this.playerHit = true;
        this.subject.next(true)
      }
      return true
    } else {
      return false
    }
  }
  detectCollision(): Observable<any>{
    return this.subject.asObservable()
  }
}
