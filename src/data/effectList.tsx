import { ActionEffect } from '../components/action/action';

export const EffectList: {[name: string] : ActionEffect} = {
	"WAIT": {
		name: "WAIT",
		symbol: "fas fa-clock"
	},
	"DAMAGE": {
		name: "DAMAGE",
		symbol: "fas fa-bahai"
	},
	"ABSORB": {
		name: "ABSORB",
		symbol: "fas fa-heart-broken"
	},
	"HEAL": {
		name: "HEAL",
		symbol: "fas fa-heart"
	},
	"CHANGE": {
		name: "CHANGE",
		symbol: "fas fa-exchange-alt"
	},
	"BOOST": {
		name: "BOOST",
		symbol: "fas fa-arrow-up"
	},
	"DROP": {
		name: "DROP",
		symbol: "fas fa-arrow-down"
	},
	"REGEN": {
		name: "REGEN",
		symbol: "fas fa-seedling"
	},
	"DEGEN": {
		name: "DEGEN",
		symbol: "fas fa-skull-crossbones"
	},
	"DISCARD": {
		name: "DISCARD",
		symbol: "fas fa-trash-restore"
	},
	"DRAW": {
		name: "DRAW",
		symbol: "fas fa-lightbulb"
	},
	"COPYCARD": {
		name: "COPYCARD",
		symbol: "far fa-copy"
	}
};