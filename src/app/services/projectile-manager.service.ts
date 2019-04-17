import { Injectable } from '@angular/core';
import {Vector} from '../canvas-components/vector.component';
import { CollisionManagerService } from './collision-manager.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectileManagerService {
  private canvas: HTMLCanvasElement;
  public projectiles = [];
  private context;
  public start = false;
  public lastStep = 0;
  private animator : any;
  constructor(private collisionManager: CollisionManagerService) {
    const that = this;
    window.cancelAnimationFrame(that.animator);
  }

  receiveCanvas(canvas){
    this.canvas = canvas
    this.context = this.canvas.getContext('2d')
  }
  beginSequence(){
    // this.start = true;
    // this.drawProjectiles()
    const that = this;
    if(that.animator){ window.cancelAnimationFrame(that.animator) }

    // const that = this;
    window.cancelAnimationFrame(that.animator);


    this.animator = window.requestAnimationFrame((milliseconds) => that.animationFrame(milliseconds));

    // function animationFrame(milliseconds) {
    //   console.log('this is ', this)
    //   var elapsed = milliseconds - this.lastStep;
    //   this.lastStep = milliseconds;
    
    //   this.render(elapsed);
    //   const that = this;
    //   window.requestAnimationFrame((milliseconds) => that.animationFrame(milliseconds));
    // }
  }
  endSequence(){
    // console.log('in end sequence');
    this.lastStep = 0;
    const that = this;
    window.cancelAnimationFrame(that.animator);
    // window.cancelAnimationFrame(that.animator);
    // window.cancelAnimationFrame(that.animationFrame);
  }
  animationFrame(milliseconds) {
    var elapsed = milliseconds - this.lastStep;
    this.lastStep = milliseconds;
  
    this.render(elapsed);
    const that = this;
    this.animator = window.requestAnimationFrame((milliseconds) => that.animationFrame(milliseconds));
  }
  render(elapsed){
    this.clearCanvas();
    this.moveProjectiles(elapsed);
    this.renderProjectiles();
  }
  clearCanvas() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height); 
  }
  moveProjectiles(milliseconds) {
    const that = this;
    this.projectiles.forEach(function(p) {
      var elapsedSeconds = milliseconds / 1000;
      var data = that.distanceAndAngleBetweenTwoPoints(p.projectile_positionX, p.projectile_positionY, p.projectile_positionX, 1000);
      // console.log('k ', data, p, elapsedSeconds)
      var velocity = data.distance /0.9 
      var toEndVector = new Vector(velocity, 90);
      
  
      p.projectile_positionX += (toEndVector.magnitudeX * elapsedSeconds);
      p.projectile_positionY += (toEndVector.magnitudeY * elapsedSeconds);
      that.collisionManager.checkCollision(p.projectile_positionX, p.projectile_positionY, p.trueHeight)
    });
  }
  renderProjectiles(){
    // console.log('slug', this)
    const that = this;
    // console.log('projectiles are ', this.projectiles);
    
    this.projectiles.forEach(function(p) {
      // console.log('beans', that.context)
      that.context.drawImage(p.imgTag, p.projectile_positionX, p.projectile_positionY+10, p.size, p.size)
      that.context.strokeStyle = '#f00';  // some color/style
      that.context.lineWidth = 1;    
      that.context.strokeRect(p.projectile_positionX, p.projectile_positionY, p.size, p.size)
    });
  }
  distanceAndAngleBetweenTwoPoints(x1, y1, x2, y2) {
    var x = Math.abs(x2 - x1),
      y = Math.abs(y2 - y1);
    return {
      distance: Math.sqrt(x * x + y * y) < 900 ? Math.sqrt(x * x + y * y) : 900,
      // convert from radians to degrees
      angle: Math.abs(Math.atan2(y, x) * 180 / Math.PI)
    }
  }
  clearProjectiles(){
    this.projectiles = [];
    this.start = false;
  }
  // updateProjectiles(){
  //   console.log('update');
    
  //   for(let i in this.projectiles){
  //     let p = this.projectiles[i];
  //     p.update();
  //     p.projectile_positionY > 990 && this.projectiles.splice(parseInt(i), 1)
  //   }
  // }
}
