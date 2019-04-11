import { Component, Input, OnInit } from '@angular/core';
import { CollisionManagerService } from '../services/collision-manager.service';
import { ProjectileManagerService } from '../services/projectile-manager.service';

export class Avatar{
    private readonly context: CanvasRenderingContext2D;
    private positionY : number;
    private positionX : number;
    public destinationX : number;
    public destinationY : number;
    private imgTag = new Image();

    public direction;
    constructor(
        private readonly canvas: HTMLCanvasElement, 
        private originX : number,
        private originY : number,
        public collisionManager : CollisionManagerService,
        public projectileManager : ProjectileManagerService
        ) {
        this.context = this.canvas.getContext('2d');
        this.positionX = this.originX;
        this.positionY = this.originY;

        this.imgTag.src = '../../assets/icons/avatar_white.png';
    }
    init(){
        this.draw()
    }
    draw(){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if(this.destinationX > this.positionX){
            this.positionX += 25
        } else if(this.destinationX < this.positionX){
            this.positionX -= 25
        }
        if(this.destinationY > this.positionY){
            this.positionY += 25
        } else if(this.destinationY < this.positionY){
            this.positionY -= 25
        }
        this.context.drawImage(this.imgTag, this.positionX, this.positionY);
        this.collisionManager.updatePlayerPosition(this.positionX, this.positionY)
        requestAnimationFrame(() => this.draw());  
    }
}