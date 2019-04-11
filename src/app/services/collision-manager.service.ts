import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CollisionManagerService {
  private playerX;
  private playerY;

  constructor() { }
  updatePlayerPosition(x, y){
    console.log('updating player, ', x, y);
    
    this.playerX = x;
    this.playerY = y;
  }
  updateProjectilePosition(x, y, iconHeight){
    console.log(x, y)
    if(Math.abs(x - this.playerX) < iconHeight && Math.abs(y - this.playerY) < iconHeight){
      console.log('COLLISION');
      return true
    } else {
      return false
    }
  }
  detectCollision(){
    console.log('collision detected');
    
  }
}
