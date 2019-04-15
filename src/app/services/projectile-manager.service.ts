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
  constructor(private collisionManager: CollisionManagerService) {
  }

  receiveCanvas(canvas){
    this.canvas = canvas
    this.context = this.canvas.getContext('2d')
  }
  beginSequence(){
    // this.start = true;
    // this.drawProjectiles()
    const that = this;
    window.requestAnimationFrame((milliseconds) => that.animationFrame(milliseconds));

    // function animationFrame(milliseconds) {
    //   console.log('this is ', this)
    //   var elapsed = milliseconds - this.lastStep;
    //   this.lastStep = milliseconds;
    
    //   this.render(elapsed);
    //   const that = this;
    //   window.requestAnimationFrame((milliseconds) => that.animationFrame(milliseconds));
    // }
  }
  animationFrame(milliseconds) {
    var elapsed = milliseconds - this.lastStep;
    this.lastStep = milliseconds;
  
    this.render(elapsed);
    const that = this;
    window.requestAnimationFrame((milliseconds) => that.animationFrame(milliseconds));
  }
  render(elapsed){
    // console.log('wtf, elapsed is ', elapsed)
    // setCanvasSize();
    this.clearCanvas();
    this.moveProjectiles(elapsed);
    this.renderProjectiles();
  }
  clearCanvas() {
    // ctx.globalCompositeOperation = "source-over";
    // ctx.fillStyle = "white";
    // ctx.fillRect(0, 0, canvas.width, canvas.height);
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height); 
  }
  moveProjectiles(milliseconds) {
    // console.log('yoo, this is ', this)
    const that = this;
    this.projectiles.forEach(function(p) {
      // console.log('P is ', p);
      
      var data = that.distanceAndAngleBetweenTwoPoints(p.projectile_positionX, p.projectile_positionY, p.projectile_positionX, 1000);
      var velocity = data.distance /0.9 
      // console.log(velocity);
      
      var toEndVector = new Vector(velocity, data.angle);

      // console.log('vector is ', toEndVector);
      

      var elapsedSeconds = milliseconds / 1000;
  
      p.projectile_positionX += (toEndVector.magnitudeX * elapsedSeconds);
      p.projectile_positionY += (toEndVector.magnitudeY * elapsedSeconds);
      that.collisionManager.checkCollision(p.projectile_positionX, p.projectile_positionY, p.trueHeight)
    });
  }
  renderProjectiles(){
    // console.log('slug', this)
    const that = this;
    this.projectiles.forEach(function(p) {
      // console.log('beans', that.context)
      that.context.drawImage(p.imgTag, p.projectile_positionX, p.projectile_positionY, p.size, p.size)
    });
  }
  distanceAndAngleBetweenTwoPoints(x1, y1, x2, y2) {
    var x = x2 - x1,
      y = y2 - y1;
    // console.log('x1 : ', x1, 'y1: ', y1, 'x2: ', x2);
    
    // console.log('inside distance and angle calc, distance is  ', Math.sqrt(x * x + y * y), 'angle is ', Math.atan2(y, x) * 180 / Math.PI)
    return {
      // x^2 + y^2 = r^2
      distance: Math.sqrt(x * x + y * y),
  
      // convert from radians to degrees
      angle: Math.atan2(y, x) * 180 / Math.PI
    }
  }
  // Vector(magnitude, angle) {
  //   var angleRadians = (angle * Math.PI) / 180;
  
  //   this.magnitudeX = magnitude * Math.cos(angleRadians);
  //   this.magnitudeY = magnitude * Math.sin(angleRadians);
  // }
  addProjectile(p){
    // console.log('adding', p);
    
    this.projectiles.push[p];
    // console.log(this.projectiles);

    // this.context.drawImage(p.imgTag, p.projectile_positionX, p.projectile_positionY, p.size, p.size)
    
  }
  clearProjectiles(){
    this.projectiles = [];
    this.start = false;
  }
  updateProjectiles(){
    console.log('update');
    
    for(let i in this.projectiles){
      let p = this.projectiles[i];
      p.update();
      p.projectile_positionY > 990 && this.projectiles.splice(parseInt(i), 1)
    }
  }
  drawProjectiles(){
    // this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);  
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
