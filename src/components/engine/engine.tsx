import React from 'react';
import '../../old_style/engine.css';
import { ChinpokoData, getChinpokoAtk, getChinpokoDef } from '../chinpoko/chinpoko';
import { Type, } from '../type/type';
import { findEffectiveness, findStab } from '../type/biome';
import { CardData } from '../card/card'
import { CardAction } from '../action/action'
import { Constants } from '../../data/const'

export function effectDamage(card: CardData, action: CardAction, ally: ChinpokoData, enemy: ChinpokoData) {
  let damage = calcDamage(action.parameters.power, card.type, ally, enemy);
  if (enemy.hp < damage) {
    damage = enemy.hp;
  }
  enemy.hp = enemy.hp - damage;
  console.log("Does " + damage + " points of damage!");
}

export function effectAbsorb(card: CardData, action: CardAction, ally: ChinpokoData, enemy: ChinpokoData) {
  let damage = calcDamage(action.parameters.power, card.type, ally, enemy);
  if (enemy.hp < damage) {
    damage = enemy.hp;
  }
  enemy.hp = enemy.hp - damage;
  console.log("Does " + damage + " points of damage!");

  let absorb = calcAbsorb(action.parameters.percentage, card.type, ally, damage);
  if (ally.hp + absorb > ally.maxhp) {
    absorb = ally.maxhp - ally.hp;
  }
  ally.hp = ally.hp + absorb;
  console.log("Absorbs " + absorb + " points of damage!");
}

export function effectHeal(card: CardData, action: CardAction, ally: ChinpokoData) {
  let heal = calcHeal(action.parameters.percentage, card.type, ally);
  if (ally.hp + heal > ally.maxhp) {
    heal = ally.maxhp - ally.hp;
  }
  ally.hp = ally.hp + heal;
  console.log("Heals " + heal + " points of damage!");
}

export function effectBoost(card: CardData, action: CardAction, ally: ChinpokoData) {
	let boost = calcBoost(action.parameters.percentage, card.type, ally);
	boost = getChinpokoStatBoost(action.parameters.stat, ally) * (1 + boost);
	if (boost > Constants.maxStatBoost) {
		boost = Constants.maxStatBoost
	}
	setChinpokoStatBoost(boost, action.parameters.stat, ally)
	console.log("Raises " + action.parameters.stat + " sharply!");
}

export function effectDrop(card: CardData, action: CardAction, ally: ChinpokoData, enemy: ChinpokoData) {
	let drop = calcDrop(action.parameters.percentage, card.type, ally, enemy)
	drop = getChinpokoStatBoost(action.parameters.stat, enemy) * (1 / (1 + drop))
	if (drop < Constants.minStatBoost) {
		drop = Constants.minStatBoost
	}
	setChinpokoStatBoost(drop, action.parameters.stat, enemy)
	console.log("Drops " + action.parameters.stat + " sharply!")
}

function calcDamage(power: number | undefined, type: Type, user: ChinpokoData, target: ChinpokoData):number {
	if (power === undefined) {
		return 0;
	}
	const stabPower = power * findStab(type, user.storedData.species.biome);
	const userAtk = getChinpokoAtk(user)
	const targetDef = getChinpokoDef(target)
	let damage = (((((2 * user.storedData.lvl) / 5) + 2) * stabPower * (userAtk / targetDef)) / 50 ) + 2;
	damage = Math.round(damage * findEffectiveness(type, target.storedData.species.biome));
	return damage;
}

function calcAbsorb(percentage: number | undefined, type: Type, user: ChinpokoData, damage: number):number {
	if (percentage === undefined) {
		return 0;
	}
	let absorb = damage * percentage * findStab(type, user.storedData.species.biome);
	absorb = Math.round(absorb);
	return absorb;
}

function calcHeal(percentage: number | undefined, type: Type, user: ChinpokoData): number {
	if (percentage === undefined) {
		return 0;
	}
	let heal = user.maxhp * percentage * findStab(type, user.storedData.species.biome);
	heal = Math.round(heal);
	return heal;
}

export function calcBoost(percentage: number | undefined, type: Type, user: ChinpokoData) {
	if (percentage === undefined) {
		return 0;
	}
	let boost = percentage * findStab(type, user.storedData.species.biome);
	return boost
}

export function calcDrop(percentage: number | undefined, type: Type, user: ChinpokoData, target: ChinpokoData) {
	if (percentage === undefined) {
		return 0;
	}
	let drop = percentage * findStab(type, user.storedData.species.biome) * findEffectiveness(type, target.storedData.species.biome)
	return drop
}

function getChinpokoStatBoost(stat: string | undefined, chinpoko: ChinpokoData): number {
	switch (stat) {
		case "HP":
			return chinpoko.hpBoost
		case "ATK":
			return chinpoko.atkBoost
		case "DEF":
			return chinpoko.defBoost
		case "SPE":
			return chinpoko.speBoost
		default:
			return 1
	}
}

function setChinpokoStatBoost(boost: number, stat: string | undefined, chinpoko: ChinpokoData) {
	switch (stat) {
		case "HP":
			chinpoko.hpBoost = boost
			return
		case "ATK":
			chinpoko.atkBoost = boost
			return
		case "DEF":
			chinpoko.defBoost = boost
			return
		case "SPE":
			chinpoko.speBoost = boost
			return
		default:
			return
	}
}

export class Engine extends React.Component {
	render() {
		return (
			<div></div>
		);
	}
}
