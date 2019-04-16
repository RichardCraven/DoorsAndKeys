import { Component, Input, OnInit } from '@angular/core';
import { CollisionManagerService } from '../services/collision-manager.service';
import { ProjectileManagerService } from '../services/projectile-manager.service';

export class Projectile {
    private readonly context: CanvasRenderingContext2D;
    private projectile_positionY : number;
    private projectile_positionX : number;
    private imgTag;
    private imgArr;
    private trueHeight;
    private size;
    private speed;
    private connectedDetected = false;

    public direction;
    constructor(
        private readonly canvas: HTMLCanvasElement, 
        private image : string, 
        private originX : number,
        private originY : number,
        public collisionManager : CollisionManagerService,
        public projectileManager : ProjectileManagerService
        ) {
        this.context = this.canvas.getContext('2d');
        this.projectile_positionX = this.originX;
        this.projectile_positionY = this.originY;
        // console.log('in constructor.. origin Y is ', this.originY, 'position Y is ', this.projectile_positionY)
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
        this.imgTag.src = this.imgArr[image].imgSrc;
    }
    update(){
        if(this.collisionManager.updateProjectilePosition(this.projectile_positionX, this.projectile_positionY, this.trueHeight)){
            // this.collisionManager.pushBackAvatar(this.projectile_positionY)
            // console.log('Y is ...',this.projectile_positionY)
            return
            if(this.projectile_positionY > 810){
                console.log('wtf');
                
                return
            }
            // this.projectile_positionY += this.speed;
        } else {
            this.projectile_positionY += this.speed;
        }
    }
}