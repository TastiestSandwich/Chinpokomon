import React from 'react';
import { ChinpokoData } from '../../components/chinpoko/chinpoko';
import { Biome } from '../../components/type/biome';
import { TypeSymbol, Type } from '../../components/type/type';
import './teamChinpoko.scss';

interface TeamChinpokoProps {
	chinpoko: ChinpokoData
	id: number
	onClick?: () => void
	currentId?: number
}

export default class TeamChinpoko extends React.Component<TeamChinpokoProps> {

	renderChinpokoSprite() {
		const species = this.props.chinpoko.storedData.species

		return (
			<div className={`team-chinpoko-component__sprite`}>
				<img src={species.sprite} alt={species.speciesName} />
			</div>
		)
	}

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
		const strongClass = "far fa-thumbs-up fa-flip-horizontal"
		const weakClass = "far fa-thumbs-down fa-flip-horizontal"
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
								<td>{chinpoko.atk}</td>
								<td>{chinpoko.def}</td>
								<td>{chinpoko.spe}</td>
							</tr>
						</tbody>
					</table>
				</div>
				{this.renderChinpokoBiomeBox(cpc, biome)}
			</div>
		)
	}

	render() {
		const isCurrent = this.props.id === this.props.currentId
		const isDead = this.props.chinpoko.hp <= 0
		const isClickable = this.props.onClick != undefined && !isDead && !isCurrent

		const baseClass = "team-chinpoko-component"
		const isClickableClass = isClickable ? `${baseClass}--clickable` : ""
		const isDeadClass = isDead ? `${baseClass}--dead` : ""
		const isCurrentClass = isCurrent ? `${baseClass}--current` : ""

		const onClick = isClickable ? this.props.onClick : () => {}

		return (
			<div className={`team-chinpoko-component ${isClickableClass} ${isDeadClass} ${isCurrentClass}`}
			onClick={onClick}>
				{this.renderChinpokoDataBox()}
				{this.renderChinpokoSprite()}
			</div>
		);
	}
}