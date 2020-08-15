import React from 'react';
import './chinpoko.scss';
import { TypeSymbol, Type } from '../type/type';
import { Biome } from '../type/biome';
import { ChinpokoList } from '../../data/chinpokoList';
import { CardData } from '../card/card';
import { roundTo, getNumberColorClass } from '../../util';
import { Constants } from '../../data/const';

export interface ChinpokoStoredData {
	name: string
	species: BaseChinpokoData
	lvl: number
	evHP: number
	evATK: number
	evDEF: number
	evSPE: number
}

export interface BaseChinpokoData {
	speciesName: string
	sprite: string
	baseHP: number
	baseATK: number
	baseDEF: number
	baseSPE: number
	biome: Biome
	power: CardData
}

export interface ChinpokoData {
	storedData: ChinpokoStoredData
	maxhp: number
	hp: number
	atk: number
	def: number
	spe: number
	powerId: number | null
	hpBoost: number
	atkBoost: number
	defBoost: number
	speBoost: number
}

export function getRandomChinpoko(): ChinpokoData {
	let index = Math.floor(Math.random() * ChinpokoList.length);
	return getChinpokoData(ChinpokoList[index]);
}

export function getChinpokoData(storedData: ChinpokoStoredData): ChinpokoData {
	let startingHP = calcHP(storedData.species.baseHP, storedData.evHP, storedData.lvl);
	let chinpoko: ChinpokoData = {
		storedData: storedData,
		maxhp: startingHP,
		hp: startingHP,
		atk: calcStat(storedData.species.baseATK, storedData.evATK, storedData.lvl),
		def: calcStat(storedData.species.baseDEF, storedData.evDEF, storedData.lvl),
		spe: calcStat(storedData.species.baseSPE, storedData.evSPE, storedData.lvl),
		powerId: null,
		hpBoost: Constants.baseStatBoost,
		atkBoost: Constants.baseStatBoost,
		defBoost: Constants.baseStatBoost,
		speBoost: Constants.baseStatBoost
	}
	return chinpoko;
}

export function getChinpokoAtk(chinpoko: ChinpokoData): number {
	return Math.floor(chinpoko.atk * chinpoko.atkBoost)
}

export function getChinpokoDef(chinpoko: ChinpokoData): number {
	return Math.floor(chinpoko.def * chinpoko.defBoost)
}

export function getChinpokoSpe(chinpoko: ChinpokoData): number {
	return Math.floor(chinpoko.spe * chinpoko.speBoost)
}

function calcStat(baseStat: number, evStat: number, lvl: number): number {
	return Math.floor(((2 * baseStat + evStat) * lvl / 100) + 5)
}

function calcHP(baseHP: number, evHP: number, lvl: number): number {
	return Math.floor(((2 * baseHP + evHP) * lvl / 100) + lvl + 10)
}

function getDisplayBoost(boost: number): string {
	const num = roundTo((boost - 1) * 100, 2)
	const sign = num >= 0 ? "+" : ""
	return sign + num + "%"
}

interface ChinpokoProps {
	chinpoko: ChinpokoData
	ally: boolean
}

export class Chinpoko extends React.Component<ChinpokoProps> {

	renderChinpokoSprite() {
		const species = this.props.chinpoko.storedData.species
		return (
			<div className={`chinpoko-component__sprite`}>
				<img src={species.sprite} alt={species.speciesName} />
			</div>
		)
	}

	// <img src={ "/images/" + this.state.species.speciesName.toLowerCase() + ".png" }  alt={ this.state.species.speciesName } />

  renderChinpokoTypeRow(parent: string, rowSymbol: string, typeList: Array<Type>) {
    return(
      <div className={`${parent}__row`}>
        <div className={`${parent}__row-symbol`}>
          <i className={rowSymbol}></i> :
        </div>
        <div className={`${parent}__row-content`}>
          { typeList.map((type, index) => (
            <TypeSymbol
            key={index}
            type={type}
            />
          ))}
        </div>
      </div>
    )
  }

	renderChinpokoBiomeBox(parent: string, biome: Biome) {
		const ally = this.props.ally
		const strongClass = ally ? "far fa-thumbs-up fa-flip-horizontal" : "fas fa-shield-alt"
		const weakClass = ally ? "far fa-thumbs-down fa-flip-horizontal" : "fas fa-bahai"
		const strong = this.renderChinpokoTypeRow("biomebox", strongClass, biome.resistance);
		const weak = this.renderChinpokoTypeRow("biomebox", weakClass, biome.weakness);

		return(
			<div className={`${parent}__biomebox biomebox`}>
				<div className="biomebox__title">
					<strong>{biome.name}</strong>
				</div>
				{ strong }
				{ weak }
			</div>
		);
	}

	renderChinpokoDataBox() {
		const {chinpoko} = this.props
		const storedData = chinpoko.storedData
		const biome = storedData.species.biome

		const healthStyle = { width: (chinpoko.hp * 96 / chinpoko.maxhp) + "%" }
		const cpc = "chinpoko-component"

		const atk = getChinpokoAtk(chinpoko)
		const atkColor = getNumberColorClass(chinpoko.atk, atk, cpc)
		const def = getChinpokoDef(chinpoko)
		const defColor = getNumberColorClass(chinpoko.def, def, cpc)
		const spe = getChinpokoSpe(chinpoko)
		const speColor = getNumberColorClass(chinpoko.spe, spe, cpc)

		const atkBoost = getDisplayBoost(chinpoko.atkBoost)
		const atkBoostColor = getNumberColorClass(1, chinpoko.atkBoost, cpc)
		const defBoost = getDisplayBoost(chinpoko.defBoost)
		const defBoostColor = getNumberColorClass(1, chinpoko.defBoost, cpc)
		const speBoost = getDisplayBoost(chinpoko.speBoost)
		const speBoostColor = getNumberColorClass(1, chinpoko.speBoost, cpc)

		return (
			<div className={`${cpc}__databox`}>
				<div className={`${cpc}__hpbox hpbox`}>
					<div className="hpbox__title">
						<div className="hpbox__name">
							{storedData.name}
						</div>
						<div className="hpbox__lvl">
							<b>lvl {storedData.lvl}</b>
						</div>
					</div>
					<div className="hpbox__healthbar" style={healthStyle}>
					</div>
					<div className="hpbox__hp">
						<b>HP </b>{chinpoko.hp} / {chinpoko.maxhp}
					</div>
				</div>
				<div className={`${cpc}__statbox`}>
					<table>
						<thead>
							<tr>
								<th>ATK</th>
								<th>DEF</th>
								<th>SPE</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td className={atkColor}>{atk}</td>
								<td className={defColor}>{def}</td>
								<td className={speColor}>{spe}</td>
							</tr>
							<tr>
								<td className={atkBoostColor}>{atkBoost}</td>
								<td className={defBoostColor}>{defBoost}</td>
								<td className={speBoostColor}>{speBoost}</td>
							</tr>
						</tbody>
					</table>
				</div>
				{this.renderChinpokoBiomeBox(cpc, biome)}
			</div>
		)
	}

	render() {
		const allyClass = this.props.ally ? "is-ally" : "is-enemy"
		return (
			<div className={`chinpoko-component chinpoko-component--${allyClass}`}>
				{this.renderChinpokoDataBox()}
				{this.renderChinpokoSprite()}
			</div>
		);
	}
}