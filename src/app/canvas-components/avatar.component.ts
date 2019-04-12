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
    private weaponImage = new Image();
    private isAttacking = false;
    private weapons : any;
    private activeWeapon : any;
    private degrees = 310;
    private upDownNum = 100;

    public direction;
    constructor(
        private readonly canvas: HTMLCanvasElement, 
        private originX : number,
        private originY : number,
        public weapon : any,
        public collisionManager : CollisionManagerService,
        public projectileManager : ProjectileManagerService
        ) {
        this.weapons = {
            spear: {
                imgSrc : '../../assets/icons/items/weapons/spear_white.png',
                strikeType : 'thrust'
            },
            sword : {
                imgSrc : '../../assets/icons/items/weapons/sword_white.png',
                strikeType : 'thrust'
            },
            flail : {
                imgSrc : '../../assets/icons/items/weapons/flail_white.png',
                strikeType : 'arc'
            },
            axe : {
                imgSrc : '../../assets/icons/items/weapons/axe_white.png',
                strikeType : 'arc'
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
        
        this.context.save();
        this.context.translate(this.positionX +35, this.positionY + 50);
        this.context.translate(0, -50);
        
        // this.isAttacking === false ? this.context.rotate(310 * Math.PI / 180) : null
        // this.context.save();
        // this.context.translate(this.positionX +35, this.positionY + 50);
        
        // this.context.translate(0, -50);
        // console.log(this.degrees)


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
            this.context.rotate(310 * Math.PI / 180)
            this.context.drawImage(this.weaponImage,-50,50, 100, 100)
            this.context.restore();
        } else {
            this.context.rotate(310 * Math.PI / 180)
            this.context.drawImage(this.weaponImage,-50,50, 100, 100)
            this.context.restore();


            this.context.drawImage(this.imgTag, this.positionX, this.positionY);
             this.collisionManager.updatePlayerPosition(this.positionX, this.positionY)
        }
        requestAnimationFrame(() => this.draw());  
    }
    attack(weapon){
        console.log('ATTACKING')
        
        
        this.isAttacking = true;
        
    }
    endAttack(){
        
    }
}