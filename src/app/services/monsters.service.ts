import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MonstersService {
  library = {
    beholder : {
      agility: 3,
      attack: 7,
      damage: 30,
      health: 180,
      type: 'beholder',
      combatMessages: {
        greeting: '"I see you..."',
        attack: [
          '*Fires death rays from its eyes*'
        ]
      }
    },
    black_banshee : {
      agility: 2,
      attack: 4,
      damage: 15,
      health: 100,
      type: 'black_banshee',
      combatMessages: {
        greeting: '"I will make you scream!"',
        attack: [
          '*Flies at you shrieking*'
        ]
      }
    },
    black_djinn : {
      agility: 3,
      attack: 6,
      damage: 21,
      health: 110,
      type: 'black_djinn',
      combatMessages: {
        greeting: '"Your fate is darkness"',
        attack: [
          '*Sends a blast of darkness at you*'
        ]
      }
    },
    black_gorgon : {
      agility: 2,
      attack: 4,
      damage: 25,
      health: 150,
      type: 'black_gorgon',
      combatMessages: {
        greeting: '"Ah, another statue for my garden.."',
        attack: [
          '*Gazes at you*'
        ]
      }
    },
    black_kronos : {
      agility: 3,
      attack: 7,
      damage: 40,
      health: 220,
      type: 'black_kronos',
      combatMessages: {
        greeting: '"I will swallow you whole!"',
        attack: [
          '*Reaches out for you*',
          '*Swings his giant arms*',
          '*Smashes down with his fists*',
        ]
      }
    },
    black_minotaur : {
      agility: 2,
      attack: 4,
      health: 80,
      type: 'black_minotaur',
      combatMessages: {
        greeting: '"Time to die, weakling!"',
        attack: [
          '*Swings its axe at you*',
          '*Lunges and chops*',
          '*Chops and lunges'
        ]
      }
    },
    black_vampire : {
      agility: 3,
      attack: 5,
      damage: 20,
      health: 140,
      type: 'black_vampire',
      combatMessages: {
        greeting: '"Kneel before me"',
        attack: [
          '*Claws at you*',
          '*Lunges and bites*'
        ]
      }
    },
    black_wraith : {
      agility: 2,
      attack: 4,
      damage: 17,
      health: 90,
      type: 'black_wraith',
      combatMessages: {
        greeting: '"Join me in eternal pain!"',
        attack: [
          '*Attempts possess you*',
          '*Contracts the space between you*'
        ]
      }
    },
    dragon : {
      agility: 1,
      attack: 8,
      damage: 50,
      health: 240,
      type: 'dragon',
      combatMessages: {
        greeting: '"You look tasty.."',
        attack: [
          '*Roars*',
          '*Bites*',
          '*Claws*',
          '*Spits fire*',
          "Die, insect!"
        ]
      }
      
    },
    giant_scorpion : {
      agility: 1,
      attack: 3,
      damage: 15,
      health: 80,
      type: 'giant_scorpion',
      combatMessages: {
        greeting: '*Screeches*',
        attack: [
          '*Tail sting*',
          '*Claw attack*'
        ]
      }
    },
    goblin : {
      agility: 3,
      attack: 2,
      damage: 10,
      health: 40,
      type: 'goblin',
      combatMessages: {
        greeting: '"For the goblin king!"',
        attack: [
          '*Bites*',
          '*Claw attack*',
          '"gyah!"'
        ]
      }
    },
    horror : {
      agility: 1,
      attack: 4,
      damage: 15,
      health: 60,
      type: 'horror',
      combatMessages: {
        greeting: '"The void awaits"',
        attack: [
          '*Tears at your soul*'
        ]
      }
    },
    imp : {
      agility: 3,
      attack: 2,
      damage: 15,
      health: 40,
      type: 'imp',
      combatMessages: {
        greeting: '"Master will be pleased!"',
        attack: [
          '*Poke*'
        ]
      }
    },
    imp_overlord : {
      agility: 2,
      attack: 3,
      damage: 15,
      health: 90,
      type: 'imp_overlord',
      combatMessages: {
        greeting: '"Submit!"',
        attack: [
          '*Whip attack*'
        ]
      }
    },
    manticore : {
      agility: 2,
      attack: 3,
      damage: 20,
      health: 100,
      type: 'manticore',
      combatMessages: {
        greeting: '*growls*',
        attack: [
          '*Claw attack*',
          '*Bite attack*',
          '*Tail sting*'
        ]
      }
    },
    mummy : {
      agility: 1,
      attack: 3,
      damage: 20,
      health: 90,
      type: 'mummy',
      combatMessages: {
        greeting: '"Enter my kingdom"',
        attack: [
          '*Shambling curse*',
          '*Wailing force*'
        ]
      }
    },
    naiad : {
      agility: 3,
      attack: 4,
      damage: 20,
      health: 60,
      type: 'naiad',
      combatMessages: {
        greeting: '"Come forward.."',
        attack: [
          '*Sings horrifically*',
          '*Seductive glare*',
          '*Bite attack*'
        ]
      }
    },
    ogre : {
      agility: 1,
      attack: 3,
      damage: 28,
      health: 100,
      type: 'ogre',
      combatMessages: {
        greeting: '"Food!"',
        attack: [
          '*Grabs at you*',
          '*Smash attack*',
          '*Bite attack*'
        ]
      }
    },
    skeleton : {
      agility: 2,
      attack: 2,
      damage: 13,
      health: 40,
      type: 'skeleton',
      combatMessages: {
        greeting: '*screeches*',
        attack: [
          '*Swings its sword*',
          '*Bite attack*'
        ]
      }
    },
    slime_mold : {
      agility: 2,
      attack: 3,
      damage: 15,
      health: 50,
      type: 'slime_mold',
      combatMessages: {
        greeting: '*blurp*',
        attack: [
          '*gloip*',
          '*blub lub*',
          '*glep*'
        ]
      }
    },
    sphinx : {
      agility: 2,
      attack: 5,
      damage: 20,
      health: 140,
      type: 'sphinx',
      combatMessages: {
        greeting: '"Riddle me this.."',
        attack: [
          '*possession*',
          '*mind blast*',
          '*soul scratch*'
        ]
      }
    },
    troll : {
      agility: 1,
      attack: 5,
      damage: 22,
      health: 140,
      type: 'troll',
      combatMessages: {
        greeting: '"Zug zug"',
        attack: [
          '*smash attack*',
          '*bite attackt*'
        ]
      }
    },
    wyvern : {
      agility: 2,
      attack: 5,
      damage: 23,
      health: 160,
      type: 'wyvern',
      combatMessages: {
        greeting: '*screeches*',
        attack: [
          '*claw attack*',
          '*bite attackt*'
        ]
      }
    }
  }
  constructor() { }
}
