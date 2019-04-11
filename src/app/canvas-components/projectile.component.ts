import { Component, Input, OnInit } from '@angular/core';
import { CollisionManagerService } from '../services/collision-manager.service';

export class Projectile {
    private readonly context: CanvasRenderingContext2D;
    private projectile_positionY = 100;
    private projectile_destinationY = 100;
    private projectile_positionX = 500;
    private projectile_destinationX = 500;
    private imgTag;
    private imgArr;
    private trueHeight;
    private size;
    // public collisionManager : CollisionManagerService;

    constructor(private readonly canvas: HTMLCanvasElement, private image : string, private speed : number, public collisionManager : CollisionManagerService) {
        this.context = this.canvas.getContext('2d');

        this.imgArr = {
            downWhite : {
                imgSrc : '../../assets/icons/misc/down-white.png',
                speed : 13,
                iconSize : 100,
                iconTrueHeight : 80
            }
        }
        this.trueHeight = this.imgArr[image].iconTrueHeight;
        this.size = this.imgArr[image].iconSize;

        this.imgTag = new Image();
        this.imgTag.src = this.imgArr[image].imgSrc
        
        this.context.drawImage(this.imgTag, this.projectile_positionX, this.projectile_positionY, this.size, this.size); 

        this.logStuff()
        this.collisionManager.detectCollision()

        window.requestAnimationFrame(() => this.draw());
    }
    logStuff(){
        console.log('inside attack component, collision manager is ', this.collisionManager);
        
        console.log(this.projectile_positionX)
        console.log(this.projectile_destinationX)
        console.log(this.projectile_positionY)
        console.log(this.projectile_destinationY)
    }
    draw() {
        // do stuff
        if(this.projectile_positionY === this.projectile_destinationY){
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);  
            this.context.drawImage(this.imgTag, this.projectile_positionX, this.projectile_positionY, 100, 100); 
        } else if(this.projectile_destinationY > this.projectile_positionY){
            this.projectile_positionY += this.speed
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height); 
            this.context.drawImage(this.imgTag, this.projectile_positionX, this.projectile_positionY, 100, 100); 
        } else if(this.projectile_destinationY < this.projectile_positionY){
            this.projectile_destinationY -= this.speed
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height); 
            this.context.drawImage(this.imgTag, this.projectile_positionX, this.projectile_positionY); 
        }

        if(this.collisionManager.updateProjectilePosition(this.projectile_positionX, this.projectile_positionY, this.trueHeight)){
            return
        }

        this.projectile_destinationY += this.speed
        if(this.projectile_positionY < 990){
            window.requestAnimationFrame(() => this.draw());
        } else {
            console.log('stop animation')
        }
      }
}