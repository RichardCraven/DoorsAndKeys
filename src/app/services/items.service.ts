import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {
  library = {
    weapons : {
      sword: {
        attack: 1,
        damage: 20,
        speed: 10
      },
      spear: {
        attack: 1,
        damage: 45,
        speed: 5
      },
      flail: {
        attack: 3,
        damage: 15,
        speed: 8
      },
      axe: {
        attack: 2,
        damage: 25,
        speed: 11
      },
      scepter: {
        attack: 3,
        damage: 35,
        speed: 12
      }
    },
    shields: {
      basic:{},
      seeing:{}
    },
    wands: {
      maerlyns_rod:{},
      vardas_wand:{},
      glindas_wand:{}
    },
    charms: {
      scarab: {

      },
      hamsa: {

      },
      beetle: {

      },
      evilai: {

      },
      nukta: {

      },
      lundi: {

      },
      demonskull: {

      },
    },
    headgear: {
      court_mask: {

      },
      solomon_mask: {

      },
      lundi_mask: {

      },
      mardi_mask: {

      },
      zul_mask: {

      },
      bundi_mask: {

      },
      helmet: {

      }
    },
    amulets: {
      nukta: {

      },
      evilai: {
        
      },
      sayan: {
        
      },
      lundi: {
        
      }
    }
  }
  constructor() { }
}
