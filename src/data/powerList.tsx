import { CardData } from '../components/card/card';
import { TypeList } from '../components/type/type';
import { EffectList } from './effectList';

export const PowerList: { [name:string] : CardData } = {
  "Change": {
    name: "Change",
    text: "Changes the current chinpoko",
    type: TypeList["NEUTRAL"],
    actions: [{
      effect: EffectList["WAIT"],
      parameters: {}
    },{
      effect: EffectList["CHANGE"],
      parameters: {
        ally: true,
        random: false
      }
    },{
      effect: EffectList["WAIT"],
      parameters: {}
    }]
  },
  "Aqua Jet": {
    name: "Aqua Jet",
    text: "Hits with a fast burst of water",
    type: TypeList["WATER"],
    actions: [{
      effect: EffectList["DAMAGE"],
      parameters: {
        power: 40,
      }
    },{
      effect: EffectList["WAIT"],
      parameters: {}
    },]
  },
  "Heat Wave": {
    name: "Heat Wave",
    text: "Surrounds the enemy in hot air",
    type: TypeList["FIRE"],
    actions: [{
      effect: EffectList["WAIT"],
      parameters: {}
    }, {
      effect: EffectList["DAMAGE"],
      parameters: {
        power: 60,
      }
    }, {
      effect: EffectList["WAIT"],
      parameters: {}
    }]
  },
  "Deep Freeze": {
    name: "Deep Freeze",
    text: "Freeze the enemy with abysmal temperature",
    type: TypeList["COLD"],
    actions: [{
      effect: EffectList["WAIT"],
      parameters: {}
    },{
      effect: EffectList["WAIT"],
      parameters: {}
    },{
      effect: EffectList["WAIT"],
      parameters: {}
    },{
      effect: EffectList["WAIT"],
      parameters: {}
    },{
      effect: EffectList["DAMAGE"],
      parameters: {
        power: 100
      }
    }]
  },
  "Charge Up": {
    name: "Charge Up",
    text: "Eat a battery to restore health",
    type: TypeList["ELECTRIC"],
    actions: [{
      effect: EffectList["WAIT"],
      parameters: {}
    },{
      effect: EffectList["HEAL"],
      parameters: {
        percentage: 0.3
      }
    }]
  },
  "Photosyntesis": {
    name: "Photosyntesis",
    text: "Lay in the sun to regain health",
    type: TypeList["GRASS"],
    actions: [{
      effect: EffectList["HEAL"],
      parameters: {
        percentage: 0.1
      }
    },{
      effect: EffectList["HEAL"],
      parameters: {
        percentage: 0.1
      }
    },{
      effect: EffectList["HEAL"],
      parameters: {
        percentage: 0.1
      }
    },{
      effect: EffectList["HEAL"],
      parameters: {
        percentage: 0.1
      }
    },{
      effect: EffectList["HEAL"],
      parameters: {
        percentage: 0.1
      }
    }]
  },
  "Superposition": {
    name: "Superposition",
    text: "Each quantum state attacks",
    type: TypeList["MISTERY"],
    actions: [{
      effect: EffectList["DAMAGE"],
      parameters: {
        power: 20,
      }
    },{
      effect: EffectList["DAMAGE"],
      parameters: {
        power: 20,
      }
    }]
  },
  "Bloodthirst": {
    name: "Bloodthirst",
    text: "Takes a small bite of the enemy and the smell of blood raises its Speed",
    type: TypeList["NEUTRAL"],
    actions: [{
      effect: EffectList["DAMAGE"],
      parameters: {
        power: 40
      }
    },{
      effect: EffectList["BOOST"],
      parameters: {
        percentage: 0.5,
        stat: "SPE",
        ally: true
      }
    },{
      effect: EffectList["WAIT"],
      parameters: {}
    }]
  },
  "Chemicatalyst": {
    name: "Chemicatalyst",
    text: "Injects a catalyst that empowers any chemical in the enemy's body",
    type: TypeList["TOXIC"],
    actions: [{
      effect: EffectList["WAIT"],
      parameters: {}
    },{
      effect: EffectList["BOOST"],
      parameters: {
        percentage: 0.5,
        stat: "HP",
        ally: false
      }
    }]
  },
  "Danger Dive": {
    name: "Danger Dive",
    text: "Dives into the enemy, boosting attack and speed from the fall",
    type: TypeList["WIND"],
    actions: [{
      effect: EffectList["BOOST"],
      parameters: {
        percentage: 0.25,
        stat: "SPE",
        ally: true
      }
    },{
      effect: EffectList["BOOST"],
      parameters: {
        percentage: 0.25,
        stat: "ATK",
        ally: true
      }
    }]
  },
  "Landfill Looting": {
    name: "Landfill Looting",
    text: "Looks for shiny trash, discarding a card to draw a new one",
    type: TypeList["ARTIFICIAL"],
    actions: [{
      effect: EffectList["DISCARD"],
      parameters: {
        ally: true
      }
    },{
      effect: EffectList["DRAW"],
      parameters: {
        number: 1,
        ally: true
      }
    }]
  },
  "Replicate": {
    name: "Replicate",
    text: "Imitates the opponent, discarding a card to create a copy of an enemy card",
    type: TypeList["TOXIC"],
    actions: [{
      effect: EffectList["DISCARD"],
      parameters: {
        ally: true
      }
    },{
      effect: EffectList["WAIT"],
      parameters: {}
    },{
      effect: EffectList["COPYCARD"],
      parameters: {
        ally: false
      }
    }]
  },
  "Pivot": {
    name: "Pivot",
    text: "Lets an ally come and fight, but then quickly changes its mind",
    type: TypeList["NEUTRAL"],
    actions: [{
      effect: EffectList["CHANGE"],
      parameters: {
        ally: true,
        random: false
      }
    },{
      effect: EffectList["EMPTY"],
      parameters: {}
    },{
      effect: EffectList["EMPTY"],
      parameters: {}
    },{
      effect: EffectList["EMPTY"],
      parameters: {}
    },{
      effect: EffectList["CHANGE"],
      parameters: {
        ally: true,
        random: false
      }
    }]
  },
  "Electrify": {
    name: "Electrify",
    text: "Charges with static electricity, electrifying an attack",
    type: TypeList["ELECTRIC"],
    actions: [{
      effect: EffectList["TYPESWAP"],
      parameters: {
        ally: true,
        type: TypeList["ELECTRIC"]
      }
    }]
  }
}