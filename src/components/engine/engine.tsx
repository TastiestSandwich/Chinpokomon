import React from 'react';
import '../../old_style/engine.css';
import { ChinpokoData, getChinpokoAtk, getChinpokoDef, getChinpokoSpe } from '../chinpoko/chinpoko';
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

export function effectStatAbsorb(card: CardData, action: CardAction, ally: ChinpokoData, enemy: ChinpokoData) {
	let drop = calcStatMod(action.parameters.percentage, card.type, ally, action.parameters.ally ? null : enemy)
	let target = action.parameters.ally ? ally : enemy
	let user = action.parameters.ally ? enemy : ally
	let stat = getStatString(action.parameters.stat)
	drop = getChinpokoStatBoost(stat, target) * (1 / (1 + drop))
	if (stat != "HP" && drop < Constants.minStatBoost) {
		drop = Constants.minStatBoost
	}
	let oldStat = getChinpokoStat(stat, target)
	setChinpokoStatBoost(drop, stat, target)
	let newStat = getChinpokoStat(stat, target)
	let diff = Math.floor(oldStat - newStat)
	console.log("Absorbs " + diff + " " + stat + " from the enemy!")
	let boost = calcReverseStatBoost(stat, diff, user)
	if (stat != "HP" && boost > Constants.maxStatBoost) {
		boost = Constants.maxStatBoost
	}
	setChinpokoStatBoost(boost, stat, user)
}

export function effectBoost(card: CardData, action: CardAction, ally: ChinpokoData, enemy: ChinpokoData) {
	let boost = calcStatMod(action.parameters.percentage, card.type, ally, action.parameters.ally ? null : enemy);
	let chinpoko = action.parameters.ally ? ally : enemy
	let stat = getStatString(action.parameters.stat)
	boost = getChinpokoStatBoost(stat, chinpoko) * (1 + boost);
	if (stat != "HP" && boost > Constants.maxStatBoost) {
		boost = Constants.maxStatBoost
	}
	setChinpokoStatBoost(boost, stat, chinpoko)
	console.log("Raises " + stat + " sharply!");
}

export function effectDrop(card: CardData, action: CardAction, ally: ChinpokoData, enemy: ChinpokoData) {
	let drop = calcStatMod(action.parameters.percentage, card.type, ally, action.parameters.ally ? null : enemy)
	let chinpoko = action.parameters.ally ? ally : enemy
	let stat = getStatString(action.parameters.stat)
	drop = getChinpokoStatBoost(stat, chinpoko) * (1 / (1 + drop))
	if (stat != "HP" && drop < Constants.minStatBoost) {
		drop = Constants.minStatBoost
	}
	setChinpokoStatBoost(drop, stat, chinpoko)
	console.log("Drops " + stat + " sharply!")
}

export function effectRegen(card: CardData, action: CardAction, ally: ChinpokoData) {
	let regen = calcStatMod(action.parameters.percentage, card.type, ally, null)
	ally.hpBoost = ally.hpBoost + ally.maxhp * regen
	console.log("Is regenerating hp!")
}

export function effectDegen(card: CardData, action: CardAction, ally: ChinpokoData, enemy: ChinpokoData) {
	let degen = calcStatMod(action.parameters.percentage, card.type, ally, enemy)
	enemy.hpBoost = enemy.hpBoost - enemy.maxhp * degen
	console.log("Is degenerating hp!")
}

export function effectDot(card: CardData, action: CardAction, ally: ChinpokoData, enemy: ChinpokoData) {
	let dot = calcDamage(action.parameters.power, card.type, ally, enemy)
	enemy.hpBoost = enemy.hpBoost - dot
	console.log("Is losing hp!")
}

export function applyHpBoost(chinpoko: ChinpokoData) {
	let hp = chinpoko.hp + chinpoko.hpBoost
	if(hp > chinpoko.maxhp) {
		hp = chinpoko.maxhp
	}
	if(hp < 0) {
		hp = 0
	}
	chinpoko.hp = Math.round(hp)
}

export function effectStatClear(card: CardData, action: CardAction, ally: ChinpokoData, enemy: ChinpokoData) {
	let stats = getStatArray(action.parameters.stat)
	let target = action.parameters.ally ? ally : enemy
	for(let stat of stats) {
		let boost = getChinpokoStatBoost(stat, target)
		let baseBoost = stat === "HP" ? Constants.baseHpBoost : Constants.baseStatBoost
		if (action.parameters.positive && boost > baseBoost) {
			boost = baseBoost
		}
		if (action.parameters.negative && boost < baseBoost) {
			boost = baseBoost
		}
		setChinpokoStatBoost(boost, stat, target)
		console.log("Cleared " + stat + "!")
	}
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

function calcReverseStatBoost(stat: string | undefined, diff: number, user: ChinpokoData): number {
	if (stat === undefined) {
		return 0
	}
	let boost = getChinpokoStatBoost(stat, user)
	let value = getChinpokoStat(stat, user)
	return boost + (diff * boost / value)
}

export function calcStatMod(mod: number | undefined, type: Type, user: ChinpokoData, target: ChinpokoData | null) {
	if (mod === undefined) {
		return 0;
	}
	let effectiveness = target != null ? findEffectiveness(type, target.storedData.species.biome) : 1
	mod = mod * findStab(type, user.storedData.species.biome) * effectiveness
	return mod
}

function getStatString(stat: string | undefined): string {
	if (stat == undefined || stat === "RND") {
		return getRandomStat()
	} else {
		return stat
	}
}

function getStatArray(stat: string | undefined): Array<string> {
	if (stat === undefined || stat === "RND") {
		return [getRandomStat()]
	} else if (stat === "ALL") {
		return ["HP","ATK","DEF","SPE"]
	} else {
		return [stat]
	}
}

function getRandomStat(): string {
	let random = Math.random() * 3
	if (random < 1) {
		return "ATK"
	} else if (random < 2) {
		return "DEF"
	} else {
		return "SPE"
	}
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

function getChinpokoStat(stat: string | undefined, chinpoko: ChinpokoData): number {
	switch (stat) {
		case "HP":
			return chinpoko.hp
		case "ATK":
			return getChinpokoAtk(chinpoko)
		case "DEF":
			return getChinpokoDef(chinpoko)
		case "SPE":
			return getChinpokoSpe(chinpoko)
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
