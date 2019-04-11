import { Component, Input, OnInit } from '@angular/core';

export class MonsterAttack {
    private readonly context: CanvasRenderingContext2D;
    private monster_attack_positionY = 100;
    private monster_attack_destinationY = 100;
    private monster_attack_positionX = 500;
    private monster_attack_destinationX = 500;
    private imgTag;

    constructor(private readonly canvas: HTMLCanvasElement) {
        this.context = this.canvas.getContext('2d');
        const monster_attack_positionY = 100;
        const monster_attack_destinationY = 100;
        this.imgTag = new Image();
        this.imgTag.src = '../../assets/scavenger.png'
        this.imgTag.height = 100
        this.imgTag.width = 100

        this.context.drawImage(this.imgTag, this.monster_attack_positionX, this.monster_attack_positionY); 

        this.logStuff()


        window.requestAnimationFrame(() => this.draw());
    }
    logStuff(){
        console.log('inside attack component');
        
        console.log(this.monster_attack_positionX)
        console.log(this.monster_attack_destinationX)
        console.log(this.monster_attack_positionY)
        console.log(this.monster_attack_destinationY)
    }
    draw() {
        console.log('go');
        
        // do stuff
        if(this.monster_attack_positionY === this.monster_attack_destinationY){
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);  
            this.context.drawImage(this.imgTag, this.monster_attack_positionX, this.monster_attack_positionY); 
        } else if(this.monster_attack_destinationY > this.monster_attack_positionY){
            this.monster_attack_positionY += 25
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height); 
            this.context.drawImage(this.imgTag, this.monster_attack_positionX, this.monster_attack_positionY); 
        } else if(this.monster_attack_destinationY < this.monster_attack_positionY){
            this.monster_attack_destinationY -= 25
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height); 
            this.context.drawImage(this.imgTag, this.monster_attack_positionX, this.monster_attack_positionY); 
        }
        this.monster_attack_destinationY += 30
        if(this.monster_attack_positionY < 990){
            console.log('continue');
            
            window.requestAnimationFrame(() => this.draw());
        } else {
            console.log('stop animation')
        }
      }
}