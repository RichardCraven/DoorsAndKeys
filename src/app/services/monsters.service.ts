import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MonstersService {
  library = {
    beholder : {
      agility: 3,
      attack: 4,
      damage: 30,
      health: 180,
      type: 'beholder'
    },
    black_banshee : {
      agility: 2,
      attack: 2,
      damage: 15,
      health: 100,
      type: 'black_banshee'
    },
    black_djinn : {
      agility: 3,
      attack: 3,
      damage: 21,
      health: 110,
      type: 'black_djinn'
    },
    black_gorgon : {
      agility: 2,
      attack: 2,
      damage: 25,
      health: 150,
      type: 'black_gorgon'
    },
    black_kronos : {
      agility: 3,
      attack: 4,
      damage: 40,
      health: 220,
      type: 'black_kronos'
    },
    black_minotaur : {
      agility: 2,
      attack: 2,
      health: 80,
      type: 'black_minotaur'
    },
    black_vampire : {
      agility: 3,
      attack: 3,
      damage: 20,
      health: 140,
      type: 'black_vampire'
    },
    black_wraith : {
      agility: 2,
      attack: 2,
      damage: 17,
      health: 90,
      type: 'black_wraith'
    },
    dragon : {
      agility: 1,
      attack: 4,
      damage: 50,
      health: 240,
      type: 'dragon'
    },
    giant_scorpion : {
      agility: 1,
      attack: 2,
      damage: 15,
      health: 80,
      type: 'giant_scorpion'
    },
    goblin : {
      agility: 3,
      attack: 1,
      damage: 10,
      health: 40,
      type: 'goblin'
    },
    horror : {
      agility: 1,
      attack: 2,
      damage: 15,
      health: 60,
      type: 'horror'
    },
    imp : {
      agility: 3,
      attack: 2,
      damage: 15,
      health: 40,
      type: 'imp'
    },
    imp_overlord : {
      agility: 2,
      attack: 3,
      damage: 15,
      health: 90,
      type: 'imp_overlord'
    },
    manticore : {
      agility: 2,
      attack: 3,
      damage: 20,
      health: 100,
      type: 'manticore'
    },
    mummy : {
      agility: 1,
      attack: 2,
      damage: 20,
      health: 90,
      type: 'mummy'
    },
    naiad : {
      agility: 3,
      attack: 2,
      damage: 20,
      health: 60,
      type: 'naiad'
    },
    ogre : {
      agility: 1,
      attack: 1,
      damage: 28,
      health: 100,
      type: 'ogre'
    },
    skeleton : {
      agility: 2,
      attack: 2,
      damage: 13,
      health: 40,
      type: 'skeleton'
    },
    slime_mold : {
      agility: 2,
      attack: 2,
      damage: 15,
      health: 50,
      type: 'slime_mold'
    },
    sphinx : {
      agility: 2,
      attack: 4,
      damage: 20,
      health: 140,
      type: 'sphinx'
    },
    troll : {
      agility: 1,
      attack: 1,
      damage: 22,
      health: 140,
      type: 'troll'
    },
    wyvern : {
      agility: 2,
      attack: 3,
      damage: 23,
      health: 160,
      type: 'wyvern'
    }
  }
  constructor() { }
}
