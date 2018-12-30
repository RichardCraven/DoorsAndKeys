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
      basic_shield:{
        type: 'basic_shield'
      },
      seeing_shield:{
        type: 'seeing_shield'
      }
    },
    wands: {
      maerlyns_rod:{
        damage: 60,
        speed: 5,
        type: 'maerlyns_rod'
      },
      vardas_wand:{
        damage: 40,
        speed: 7,
        type: 'vardas_wand'
      },
      glindas_wand:{
        damage: 50,
        speed: 6,
        type: 'glindas_wand'
      }
    },
    charms: {
      scarab_charm: {
        type: 'scarab_charm'
      },
      hamsa_charm: {
        type: 'hamsa_charm'
      },
      beetle_charm: {
        type: 'beetle_charm'
      },
      evilai_charm: {
        type: 'evilai_charm'
      },
      nukta_charm: {
        type: 'nukta_charm'
      },
      lundi_charm: {
        type: 'lundi_charm'
      },
      demonskull_charm: {
        type: 'demonskull_charm'
      },
    },
    headgear: {
      court_mask: {
        type: 'court_mask'
      },
      solomon_mask: {
        type: 'solomon_mask'
      },
      lundi_mask: {
        type: 'lundi_mask'
      },
      mardi_mask: {
        type: 'mardi_mask'
      },
      zul_mask: {
        type: 'zul_mask'
      },
      bundu_mask: {
        type: 'bundu_mask'
      },
      helmet: {
        type: 'helmet'
      }
    },
    amulets: {
      nukta_amulet: {
        type: 'nukta_amulet'
      },
      evilai_amulet: {
        type: 'evilai_amulet'
      },
      sayan_amulet: {
        type: 'sayan_amulet'
      },
      lundi_amulet: {
        type: 'lundi_amulet'
      }
    },
    misc: {
      lantern: {
        type: 'lantern'
      },
      key: {
        type: 'key'
      },
    }
  }
  constructor() { }
}
