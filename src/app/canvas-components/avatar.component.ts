import { Component, Input, OnInit } from '@angular/core';
import { CollisionManagerService } from '../services/collision-manager.service';
import { ProjectileManagerService } from '../services/projectile-manager.service';
import {PlayerManagerService} from '../services/player-manager.service'

export class Avatar{
    private readonly context: CanvasRenderingContext2D;
    private positionY : number;
    private positionX : number;
    public destinationX : number;
    public destinationY : number;
    private imgTag = new Image();
    private weaponImage = new Image();
    private isAttacking = false;
    private weapons : any;
    private activeWeapon : any;
    private degrees = 310;
    public upDownNum = 0;
    public monsterStruck = false;
    public isBeingPushedBack = false;
    private lastStep = 0;
    // private playerManagerService : PlayerManagerService;

    public direction;
    constructor(
        private readonly canvas: HTMLCanvasElement, 
        private originX : number,
        private originY : number,
        public weapon : any,
        public collisionManager : CollisionManagerService,
        public projectileManager : ProjectileManagerService,
        public playerManagerService : PlayerManagerService
        ) {
        this.weapons = {
            spear: {
                imgSrc : '../../assets/icons/items/weapons/spear_upright_white.png',
                strikeType : 'thrust',
                range: 180
            },
            sword : {
                imgSrc : '../../assets/icons/items/weapons/sword_upright_white.png',
                strikeType : 'thrust',
                range: 100
            },
            flail : {
                imgSrc : '../../assets/icons/items/weapons/flail_upright_white.png',
                strikeType : 'thrust',
                range: 130
            },
            axe : {
                imgSrc : '../../assets/icons/items/weapons/axe_upright_white.png',
                strikeType : 'thrust',
                range: 120
            }
        }

        this.activeWeapon = this.weapon;
        this.weaponImage.src = this.weapons[this.activeWeapon].imgSrc

        this.context = this.canvas.getContext('2d');
        this.positionX = this.originX;
        this.positionY = this.originY;

        this.imgTag.src = '../../assets/icons/avatar_white.png';
    }
    init(){
        this.collisionManager.detectCollision().subscribe(res => {
            // !this.playerLocked && this.playerHit();
            this.isBeingPushedBack = true;
            if(res.y_value && res.y_value < 850 && this.positionY < 900){
                this.positionY  = res.y_value + 50
            } else if (res.y_value > 850){
                this.positionY = this.destinationY = 900
            }
        })
        requestAnimationFrame((milliseconds) => this.draw(milliseconds));
    }
    animationFrame(milliseconds) {
        var elapsed = milliseconds - this.lastStep;
        this.lastStep = milliseconds;
      
        this.draw(elapsed);
        
        window.requestAnimationFrame(this.animationFrame);
    }
    reset(){
        if(this.positionY > 850){
            this.positionY = 900
            this.destinationY = 900
        }
    }
    draw(elapsed){
        // let elapsed = milliseconds - this.lastStep;
        // this.lastStep = milliseconds;
        // console.log('milliseconds :', milliseconds)
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const attackPositionY = this.positionY - this.upDownNum
        
        if(!this.isBeingPushedBack){
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
        }
        
        // this.context.save();
        // this.context.translate(this.positionX +35, this.positionY + 50);
        // this.context.translate(0, -50);

        if(this.isAttacking && this.weapons[this.activeWeapon].strikeType === 'arc'){ 
            this.context.rotate(this.degrees * Math.PI / 180);
            if(this.degrees > 220){
                this.degrees-= 5
                // console.log(this.degrees)

                this.context.drawImage(this.weaponImage,-50,50, 100, 100)

            } else {
                this.isAttacking = false;
                this.degrees = 310
            }
            this.context.restore();
            //set the origin to the right of the avatar
            //rotate the context
            
            // this.context.drawImage(image, -image.width / 2, -image.height / 2);
            

            this.context.drawImage(this.imgTag, this.positionX, this.positionY);
            this.collisionManager.updatePlayerPosition(this.positionX, this.positionY)

            
        } else if(this.isAttacking && this.weapons[this.activeWeapon].strikeType === 'thrust') {
            // this.context.rotate(310 * Math.PI / 180)
            const monsterStruck = false;
            
            const attackPositionX = this.positionX+65
            this.context.drawImage(this.weaponImage,this.positionX+65, attackPositionY, 100, 100)
            // this.context.restore();
            if(Math.abs(attackPositionY - this.collisionManager.monsterY) < 50 && Math.abs(attackPositionX - this.collisionManager.monsterX) < 100 )
            if(this.collisionManager.checkMonsterCollision(attackPositionX, attackPositionY)){
                this.isAttacking = false;
                this.monsterStruck = true;
                this.playerManagerService.globalSubject.next('monster-struck')
            }

            // if(attackPositionY)
            if(this.upDownNum < this.weapons[this.activeWeapon].range && !this.monsterStruck){
                this.upDownNum+= 10
            } else if(this.monsterStruck){
                // this.
            } else {
                this.isAttacking = false;
                this.upDownNum = 0;
            }
            this.context.drawImage(this.imgTag, this.positionX, this.positionY);

        } else if(this.monsterStruck){
            this.context.drawImage(this.weaponImage, this.positionX+65,attackPositionY, 100, 100)

            this.context.drawImage(this.imgTag, this.positionX, this.positionY);
             this.collisionManager.updatePlayerPosition(this.positionX, this.positionY)
        }
         else {
            // this.context.rotate(310 * Math.PI / 180)
            // this.context.restore();

            this.context.drawImage(this.weaponImage, this.positionX+65,this.positionY, 100, 100)

            this.context.drawImage(this.imgTag, this.positionX, this.positionY);
             this.collisionManager.updatePlayerPosition(this.positionX, this.positionY)
        }
        if(this.positionY > 850){
            this.isBeingPushedBack = false;
        }
        requestAnimationFrame((milliseconds) => this.draw(milliseconds));  
    }
    attack(){
        this.isAttacking = true;
    }
    endAttack(){
        
    }
}