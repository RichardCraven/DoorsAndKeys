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

  constructor() { }
  updatePlayerPosition(x, y){
    this.playerX = x;
    this.playerY = y;
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
