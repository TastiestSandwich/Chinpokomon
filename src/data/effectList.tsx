import { ActionEffect } from '../components/card/card';

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
	}
};