import { CardData } from '../components/card/card';
import { TypeList } from '../components/type/type';
import { EffectList } from './effectList';

export const CardList: { [name:string] : CardData } = {
	"Quick Attack": {
		name: "Quick Attack",
		text: "Quickly strikes the enemy",
		type: TypeList["NEUTRAL"],
		actions: [{
			effect: EffectList["DAMAGE"],
			parameters: {
				power: 30,
			}
		}]
	},
	"Water Gun": {
		name: "Water Gun",
		text: "Soaks the enemy in water",
		type: TypeList["WATER"],
		actions: [{
			effect: EffectList["WAIT"],
			parameters: {}
		},{
			effect: EffectList["DAMAGE"],
			parameters: {
				power: 50,
			}
		}]
	},
	"Mega Drain": {
		name: "Mega Drain",
		text: "Drains the enemy's health, recovering half the damage done",
		type: TypeList["GRASS"],
		actions: [{
			effect: EffectList["WAIT"],
			parameters: {}
		},{
			effect: EffectList["WAIT"],
			parameters: {}
		},{
			effect: EffectList["ABSORB"],
			parameters: {
				power: 60,
				percentage: 0.5,
			}
		}]
	},
	"Flamethrower": {
		name: "Flamethrower",
		text: "Burns the enemy with a stream of fire",
		type: TypeList["FIRE"],
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
			effect: EffectList["DAMAGE"],
			parameters: {
				power: 90,
			}
		}]
	},
	"Rest": {
		name: "Rest",
		text: "Rests and recovers half of its health",
		type: TypeList["NEUTRAL"],
		actions: [{
			effect: EffectList["WAIT"],
			parameters: {}
		},{
			effect: EffectList["WAIT"],
			parameters: {}
		},{
			effect: EffectList["HEAL"],
			parameters: {
				percentage: 0.5,
			}
		},{
			effect: EffectList["WAIT"],
			parameters: {}
		}]
	},
	"Volt Switch": {
		name: "Volt Switch",
		text: "Attacks with electricity and then goes back",
		type: TypeList["ELECTRIC"],
		actions: [{
			effect: EffectList["WAIT"],
			parameters: {}
		},{
			effect: EffectList["DAMAGE"],
			parameters: {
				power: 50
			}
		},{
			effect: EffectList["CHANGE"],
			parameters: {}
		}]
	},
	"Earthquake": {
		name: "Earthquake",
		text: "Shakes the earth with great strength",
		type: TypeList["EARTH"],
		actions: [{
			effect: EffectList["WAIT"],
			parameters: {}
		},{
			effect: EffectList["WAIT"],
			parameters: {}	
		},{
			effect: EffectList["DAMAGE"],
			parameters: {
				power: 40
			}
		},{
			effect: EffectList["DAMAGE"],
			parameters: {
				power: 40
			}
		},{
			effect: EffectList["DAMAGE"],
			parameters: {
				power: 40
			}
		}]
	},
	"Ice Shard": {
		name: "Ice Shard",
		text: "Launches a fast shard of sharp ice",
		type: TypeList["COLD"],
		actions: [{
			effect: EffectList["DAMAGE"],
			parameters: {
				power: 30
			}
		}]
	},
	"Wake Turbulence": {
		name: "Wake Turbulence",
		text: "Leaves at high speed, leaving turbulent winds afterwards",
		type: TypeList["WIND"],
		actions: [{
			effect: EffectList["CHANGE"],
			parameters: {}
		},{
			effect: EffectList["DAMAGE"],
			parameters: {
				power: 30
			}
		}]
	},
	"Poison Sting": {
		name: "Poison Sting",
		text: "Stings the enemy with venom, causing damage later",
		type: TypeList["TOXIC"],
		actions: [{
			effect: EffectList["DAMAGE"],
			parameters: {
				power: 20
			}
		},{
			effect: EffectList["WAIT"],
			parameters: {}
		},{
			effect: EffectList["WAIT"],
			parameters: {}
		},{
			effect: EffectList["DAMAGE"],
			parameters: {
				power: 65
			}
		}]
	},
	"Recycle Bite": {
		name: "Recycle Bite",
		text: "Bites the enemy, recycling the damage to health",
		type: TypeList["ARTIFICIAL"],
		actions: [{
			effect: EffectList["WAIT"],
			parameters: {}
		},{
			effect: EffectList["ABSORB"],
			parameters:{
				power: 40,
				percentage: 0.65
			}
		}]
	},
	"Uncertainty": {
		name: "Uncertainty",
		text: "Misteriously vanishes after recomposing itself",
		type: TypeList["MISTERY"],
		actions: [{
			effect: EffectList["HEAL"],
			parameters: {
				percentage: 0.2
			}
		},{
			effect: EffectList["CHANGE"],
			parameters: {}
		},{
			effect: EffectList["WAIT"],
			parameters: {}
		}]
	},
	"Fast Change": {
		name: "Fast Change",
		text: "Quickly changes the current chinpoko",
		type: TypeList["NEUTRAL"],
		actions: [{
			effect: EffectList["CHANGE"],
			parameters: {}
		}]
	},
	"Body Slam": {
		name: "Body Slam",
		text: "Slams its body against the enemy",
		type: TypeList["NEUTRAL"],
		actions: [{
			effect: EffectList["WAIT"],
			parameters: {}
		},{
			effect: EffectList["WAIT"],
			parameters: {}
		},{
			effect: EffectList["DAMAGE"],
			parameters: {
				power: 70
			}
		}]
	},
	"Growth": {
		name: "Growth",
		text: "The user nourishes itself to regenerate HP",
		type: TypeList["GRASS"],
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
			effect: EffectList["REGEN"],
			parameters: {
				percentage: 0.15
			}
		}]
	},
	"Hot Blood": {
		name: "Hot Blood",
		text: "Pumps adrenaline to raise Attack",
		type: TypeList["FIRE"],
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
			effect: EffectList["BOOST"],
			parameters: {
				percentage: 0.7,
				stat: "ATK"
			}
		}]
	},
	"Stone Skin": {
		name: "Stone Skin",
		text: "Surrounds itself in sand and stone to raise Defense",
		type: TypeList["EARTH"],
		actions: [{
			effect: EffectList["WAIT"],
			parameters: {}
		},{
			effect: EffectList["WAIT"],
			parameters: {}
		},{
			effect: EffectList["BOOST"],
			parameters: {
				percentage: 0.7,
				stat: "DEF"
			}
		},{
			effect: EffectList["WAIT"],
			parameters: {}
		}]
	},
	"Tailwind": {
		name: "Tailwind",
		text: "Strong winds propel the user, raising Speed",
		type: TypeList["WIND"],
		actions: [{
			effect: EffectList["WAIT"],
			parameters: {}
		},{
			effect: EffectList["BOOST"],
			parameters: {
				percentage: 0.7,
				stat: "SPE"
			}
		},{
			effect: EffectList["WAIT"],
			parameters: {}
		}]
	},
	"Pollution": {
		name: "Pollution",
		text: "Contamination reduces the enemy’s health, degenerating its HP",
		type: TypeList["TOXIC"],
		actions: [{
			effect: EffectList["WAIT"],
			parameters: {}
		},{
			effect: EffectList["WAIT"],
			parameters: {}
		},{
			effect: EffectList["DEGEN"],
			parameters: {
				percentage: 0.15
			}
		}]
	},
	"Street Smarts": {
		name: "Street Smarts",
		text: "The wounds from survival intimidate the enemy, dropping its Attack",
		type: TypeList["ARTIFICIAL"],
		actions: [{
			effect: EffectList["WAIT"],
			parameters: {}
		},{
			effect: EffectList["WAIT"],
			parameters: {}
		},{
			effect: EffectList["DROP"],
			parameters: {
				percentage: 0.7,
				stat: "ATK"
			}
		},{
			effect: EffectList["WAIT"],
			parameters: {}
		}]
	},
	"Frostbite": {
		name: "Frostbite",
		text: "Sub-zero temperatures make the enemy shiver, dropping its Defense",
		type: TypeList["COLD"],
		actions: [{
			effect: EffectList["WAIT"],
			parameters: {}
		},{
			effect: EffectList["WAIT"],
			parameters: {}
		},{
			effect: EffectList["DROP"],
			parameters: {
				percentage: 0.7,
				stat: "DEF"
			}
		}]
	},
	"Thunderwave": {
		name: "Thunderwave",
		text: "An electric shock immobilizes the enemy, dropping its Speed",
		type: TypeList["ELECTRIC"],
		actions: [{
			effect: EffectList["WAIT"],
			parameters: {}
		},{
			effect: EffectList["DROP"],
			parameters: {
				percentage: 0.7,
				stat: "SPE"
			}
		}]
	},
}