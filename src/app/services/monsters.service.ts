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
      health: 180
    },
    black_banshee : {
      agility: 2,
      attack: 2,
      damage: 15,
      health: 100
    },
    black_djinn : {
      agility: 3,
      attack: 3,
      damage: 21,
      health: 110
    },
    black_gorgon : {
      agility: 2,
      attack: 2,
      damage: 25,
      health: 150
    },
    black_kronos : {
      agility: 3,
      attack: 4,
      damage: 40,
      health: 220
    },
    black_minotaur : {
      agility: 2,
      attack: 2,
      health: 80
    },
    black_vampire : {
      agility: 3,
      attack: 3,
      damage: 20,
      health: 140
    },
    black_wraith : {
      agility: 2,
      attack: 2,
      damage: 17,
      health: 90
    },
    dragon : {
      agility: 1,
      attack: 4,
      damage: 50,
      health: 240
    },
    giant_scorpion : {
      agility: 1,
      attack: 2,
      damage: 15,
      health: 80
    },
    goblin : {
      agility: 3,
      attack: 1,
      damage: 10,
      health: 40
    },
    horror : {
      agility: 1,
      attack: 2,
      damage: 15,
      health: 60
    },
    imp : {
      agility: 3,
      attack: 2,
      damage: 15,
      health: 40
    },
    imp_overlord : {
      agility: 2,
      attack: 3,
      damage: 15,
      health: 90
    },
    manticore : {
      agility: 2,
      attack: 3,
      damage: 20,
      health: 100
    },
    mummy : {
      agility: 1,
      attack: 2,
      damage: 20,
      health: 90
    },
    naiad : {
      agility: 3,
      attack: 2,
      damage: 20,
      health: 60
    },
    ogre : {
      agility: 1,
      attack: 1,
      damage: 28,
      health: 100
    },
    skeleton : {
      agility: 2,
      attack: 2,
      damage: 13,
      health: 40
    },
    slime_mold : {
      agility: 2,
      attack: 2,
      damage: 15,
      health: 50
    },
    sphinx : {
      agility: 2,
      attack: 4,
      damage: 20,
      health: 140
    },
    troll : {
      agility: 1,
      attack: 1,
      damage: 22,
      health: 140
    },
    wyvern : {
      agility: 2,
      attack: 3,
      damage: 23,
      health: 160
    }
  }
  constructor() { }
}
