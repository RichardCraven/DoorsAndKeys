import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {
  library = {
    weapons : {
      sword: {
        attack: 1,
        // damage: 20,
        damage: 40,
        speed: 10,
        type: 'sword'
      },
      spear: {
        attack: 1,
        // damage: 45,
        damage: 90,
        speed: 5,
        type: 'spear'
      },
      flail: {
        attack: 3,
        // damage: 15,
        damage: 30,
        speed: 8,
        type: 'flail'
      },
      axe: {
        attack: 2,
        // damage: 25,
        damage: 50,
        speed: 11,
        type: 'axe'
      },
      scepter: {
        attack: 3,
        // damage: 35,
        damage: 70,
        speed: 12,
        type: 'scepter'
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
