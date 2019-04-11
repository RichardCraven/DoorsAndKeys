import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProjectileManagerService {
  private canvas: HTMLCanvasElement;
  public projectiles = [];
  private context;
  public start = false;
  constructor() { }

  receiveCanvas(canvas){
    this.canvas = canvas
    this.context = this.canvas.getContext('2d')
  }
  beginSequence(){
    // console.log('beginning, arr is ', this.projectiles)
    this.start = true;
    this.drawProjectiles()
  }
  addProjectile(p){
    // console.log('adding', p);
    
    this.projectiles.push[p];
    // console.log(this.projectiles);
    
  }
  clearProjectiles(){
    console.log('CLEARING PROJECTILES');
    
    this.projectiles = [];
    this.start = false;
  }
  updateProjectiles(){
    for(let i in this.projectiles){
      let p = this.projectiles[i];
      p.update();
      p.projectile_positionY > 990 && this.projectiles.splice(parseInt(i), 1)
    }
  }
  drawProjectiles(){
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);  
    this.updateProjectiles();
    for(let i in this.projectiles){
      let p = this.projectiles[i];
      this.context.drawImage(p.imgTag, p.projectile_positionX, p.projectile_positionY, p.size, p.size)
    }
    if(this.start){
      requestAnimationFrame(() => this.drawProjectiles());
    }
  }
}
