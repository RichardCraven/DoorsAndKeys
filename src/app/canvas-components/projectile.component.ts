import { Component, Input, OnInit } from '@angular/core';
import { CollisionManagerService } from '../services/collision-manager.service';
import { ProjectileManagerService } from '../services/projectile-manager.service';

export class Projectile {
    private readonly context: CanvasRenderingContext2D;
    private projectile_positionY = 100;
    private projectile_destinationY = 100;
    private projectile_positionX : number;
    private projectile_destinationX = 500;
    private imgTag;
    private imgArr;
    private trueHeight;
    private size;
    private speed;

    public direction;
    // public collisionManager : CollisionManagerService;

    constructor(
        private readonly canvas: HTMLCanvasElement, 
        private image : string, 
        private originX : number,
        public collisionManager : CollisionManagerService,
        public projectileManager : ProjectileManagerService
        ) {
        this.context = this.canvas.getContext('2d');
        console.log('originX is ', this.originX)
        this.projectile_positionX = this.originX;
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
        this.speed = this.imgArr[image].speed;


        this.imgTag = new Image();
        this.imgTag.src = this.imgArr[image].imgSrc
        
        // this.collisionManager.detectCollision()
        console.log('in constructor, x y is ', this.projectile_positionX, this.projectile_positionY, this.speed)
        // window.requestAnimationFrame(() => this.draw());
    }
    update(){
        this.projectile_positionY += this.speed
        // console.log(this.projectile_positionY)
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