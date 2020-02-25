import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MonstersService {
  library = {
    beholder : {
      agility: 3,
      armor: 4,
      attack: 7,
      damage: 30,
      health: 180,
      cunning: 8,
      type: 'beholder',
      combatMessages: {
        greeting: '"I see you..."',
        attack: [
          '*Fires death rays from its eyes*'
        ]
      },
      guards: ['black_wraith', 'black_wraith', 'black_wraith']
    },
    black_banshee : {
      agility: 2,
      armor: 1,
      attack: 4,
      damage: 15,
      health: 100,
      cunning: 2,
      type: 'black_banshee',
      combatMessages: {
        greeting: '"I will make you scream!"',
        attack: [
          '*Flies at you shrieking*'
        ]
      },
      guards: ['horror', 'horror']
    },
    black_djinn : {
      agility: 3,
      armor: 5,
      attack: 6,
      damage: 21,
      health: 110,
      cunning: 5,
      type: 'black_djinn',
      combatMessages: {
        greeting: '"Your fate is darkness"',
        attack: [
          '*Sends a blast of darkness at you*'
        ]
      },
      guards: ['imp', 'imp_overlord', 'imp']
    },
    black_gorgon : {
      agility: 2,
      armor: 5,
      attack: 4,
      damage: 25,
      health: 150,
      cunning: 3,
      type: 'black_gorgon',
      combatMessages: {
        greeting: '"Ah, another statue for my garden.."',
        attack: [
          '*Gazes at you*'
        ]
      },
      guards: ['horror', 'imp_overlord']
    },
    black_kronos : {
      agility: 3,
      armor: 6,
      attack: 7,
      damage: 40,
      health: 220,
      cunning: 6,
      type: 'black_kronos',
      combatMessages: {
        greeting: '"I will swallow you whole!"',
        attack: [
          '*Reaches out for you*',
          '*Swings his giant arms*',
          '*Smashes down with his fists*',
        ]
      },
      guards: ['black_minotaur', 'black_gorgon']
    },
    black_minotaur : {
      agility: 2,
      armor: 3,
      attack: 4,
      health: 80,
      damage: 18,
      cunning: 2,
      type: 'black_minotaur',
      combatMessages: {
        greeting: '"Time to die, weakling!"',
        attack: [
          '*Swings its axe at you*',
          '*Lunges and chops*',
          '*Chops and lunges'
        ]
      },
      guards: ['black_minotaur']
    },
    black_vampire : {
      agility: 3,
      armor: 2,
      attack: 5,
      damage: 20,
      health: 140,
      cunning: 5,
      type: 'black_vampire',
      combatMessages: {
        greeting: '"Kneel before me"',
        attack: [
          '*Claws at you*',
          '*Lunges and bites*'
        ]
      },
      guards: ['skeleton', 'skeleton']
    },
    black_wraith : {
      agility: 2,
      armor: 1,
      attack: 4,
      damage: 17,
      health: 90,
      cunning: 2,
      type: 'black_wraith',
      combatMessages: {
        greeting: '"Join me in eternal pain!"',
        attack: [
          '*Attempts possess you*',
          '*Contracts the space between you*'
        ]
      },
      guards: ['horror', 'horror']
    },
    dragon : {
      agility: 1,
      armor: 9,
      attack: 8,
      damage: 50,
      health: 240,
      cunning: 7,
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
      },
      guards: ['giant_scorpion', 'horror', 'black_minotaur', 'imp']
      
    },
    giant_scorpion : {
      agility: 1,
      armor: 2,
      attack: 3,
      damage: 15,
      health: 80,
      cunning: 2,
      type: 'giant_scorpion',
      combatMessages: {
        greeting: '*Screeches*',
        attack: [
          '*Tail sting*',
          '*Claw attack*'
        ]
      },
      guards: ['goblin', 'goblin']
    },
    goblin : {
      agility: 3,
      armor: 0,
      attack: 2,
      damage: 10,
      health: 40,
      cunning: 2,
      type: 'goblin',
      combatMessages: {
        greeting: '"For the goblin king!"',
        attack: [
          '*Bites*',
          '*Claw attack*',
          '"gyah!"'
        ]
      },
      guards: ['goblin', 'goblin']
    },
    horror : {
      agility: 1,
      armor: 2,
      attack: 4,
      damage: 15,
      health: 60,
      cunning: 3,
      type: 'horror',
      combatMessages: {
        greeting: '"The void awaits"',
        attack: [
          '*Tears at your soul*'
        ]
      },
      guards: ['horror', 'horror']
    },
    imp : {
      agility: 3,
      armor: 0,
      attack: 2,
      damage: 15,
      health: 40,
      cunning: 1,
      type: 'imp',
      combatMessages: {
        greeting: '"Master will be pleased!"',
        attack: [
          '*Poke*'
        ]
      },
      guards: ['imp', 'imp']
    },
    imp_overlord : {
      agility: 2,
      armor: 2,
      attack: 3,
      damage: 15,
      health: 90,
      cunning: 4,
      type: 'imp_overlord',
      combatMessages: {
        greeting: '"Submit!"',
        attack: [
          '*Whip attack*'
        ]
      },
      guards: ['imp', 'imp', 'imp', 'imp', 'imp']
    },
    manticore : {
      agility: 2,
      armor: 4,
      attack: 3,
      damage: 20,
      health: 100,
      cunning: 3,
      type: 'manticore',
      combatMessages: {
        greeting: '*growls*',
        attack: [
          '*Claw attack*',
          '*Bite attack*',
          '*Tail sting*'
        ]
      },
      guards: ['black_minotaur']
    },
    mummy : {
      agility: 1,
      armor: 3,
      attack: 3,
      damage: 20,
      health: 90,
      cunning: 2,
      type: 'mummy',
      combatMessages: {
        greeting: '"Enter my kingdom"',
        attack: [
          '*Shambling curse*',
          '*Wailing force*'
        ]
      },
      guards: ['skeleton', 'skeleton']
    },
    naiad : {
      agility: 3,
      armor: 2,
      attack: 4,
      damage: 20,
      health: 60,
      cunning: 4,
      type: 'naiad',
      combatMessages: {
        greeting: '"Come forward.."',
        attack: [
          '*Sings horrifically*',
          '*Seductive glare*',
          '*Bite attack*'
        ]
      },
      guards: ['horror', 'horror']
    },
    ogre : {
      agility: 1,
      armor: 5,
      attack: 3,
      damage: 28,
      health: 100,
      cunning: 2,
      type: 'ogre',
      combatMessages: {
        greeting: '"Food!"',
        attack: [
          '*Grabs at you*',
          '*Smash attack*',
          '*Bite attack*'
        ]
      },
      guards: ['troll', 'skeleton']
    },
    skeleton : {
      agility: 2,
      armor: 1,
      attack: 2,
      damage: 13,
      health: 40,
      cunning: 1,
      type: 'skeleton',
      combatMessages: {
        greeting: '*screeches*',
        attack: [
          '*Swings its sword*',
          '*Bite attack*'
        ]
      },
      guards: ['skeleton', 'skeleton']
    },
    slime_mold : {
      agility: 2,
      armor: 0,
      attack: 3,
      damage: 15,
      health: 50,
      cunning: 2,
      type: 'slime_mold',
      combatMessages: {
        greeting: '*blurp*',
        attack: [
          '*gloip*',
          '*blub lub*',
          '*glep*'
        ]
      },
      guards: ['slime_mold', 'slime_mold']
    },
    sphinx : {
      agility: 2,
      armor: 4,
      attack: 5,
      damage: 20,
      health: 140,
      cunning: 9,
      type: 'sphinx',
      combatMessages: {
        greeting: '"Riddle me this.."',
        attack: [
          '*possession*',
          '*mind blast*',
          '*soul scratch*'
        ]
      },
      guards: ['horror', 'horror']
    },
    troll : {
      agility: 1,
      armor: 4,
      attack: 5,
      damage: 22,
      health: 140,
      cunning: 2,
      type: 'troll',
      combatMessages: {
        greeting: '"Zug zug"',
        attack: [
          '*smash attack*',
          '*bite attackt*'
        ]
      },
      guards: ['goblin', 'giant_scorpion', 'goblin']
    },
    wyvern : {
      agility: 2,
      armor: 3,
      attack: 5,
      damage: 23,
      health: 160,
      cunning: 3,
      type: 'wyvern',
      combatMessages: {
        greeting: '*screeches*',
        attack: [
          '*claw attack*',
          '*bite attackt*'
        ]
      },
      guards: ['giant_scorpion', 'giant_scorpion']
    }
  }
  constructor() { }
}
