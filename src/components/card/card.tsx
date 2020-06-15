import React from 'react';
import './card.scss';
import { GameStage } from '../../views/game/game';
import { Type, TypeSymbol } from '../type/type';
import { CardList } from '../../data/cardList';
import { CardAction } from '../action/action';
import { ActionSymbol } from '../action/action';

export function shuffle(array: Array<number>) {
	for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export enum CardSource {
  DECK,
  POWER
}

export interface CardInstance {
	card: CardData
	id: number
	isClicked: boolean
	isRemovable: boolean
  source: CardSource
}

export interface CardData {
  name: string
  text: string
  type: Type
  actions: Array<CardAction>
}

function getRandomCard() {
	let index = Math.floor(Math.random() * Object.values(CardList).length);
	return Object.values(CardList)[index];
}

export function getRandomCardInstance(id: number) {
	const card = getRandomCard();
	const instance = getCardInstance(id, card, true, CardSource.DECK);
	return instance
}

export function getCardInstance(id: number, card: CardData, isRemovable: boolean, source: CardSource) {
	const instance: CardInstance = {
		card: card,
		id: id,
		isClicked: false,
		isRemovable: isRemovable,
    source: source
	};
	return instance;
}

interface CardProps {
	instance: CardInstance
	ally: boolean
  stage: GameStage
	onClick?: () => void
  antiCheat: boolean
  handHover: boolean
}

export default class Card extends React.Component<CardProps, {} > {

	render() {
		const { instance, ally } = this.props
		const type = instance.card.type
		const ccc = "card-component"
		const allyClass = ally ? `${ccc}--is-ally` : `${ccc}--is-enemy`

    const showByAntiCheat = !this.props.antiCheat || this.props.handHover
    const show = ally && showByAntiCheat
    const hideClass = show ? "" : `${ccc}--is-hide` 
    
		const isClickedClass = instance.isClicked && showByAntiCheat ? `${ccc}--is-clicked` : ""

    const isClickable = !!this.props.onClick && !instance.isClicked && this.props.stage === GameStage.PLAY
    const onClick = isClickable ? this.props.onClick : () => {}
		const isClickableClass = isClickable ? `${ccc}--is-clickable` : ""

		return(
			<div className={`${ccc} ${ccc}--type-${type.name} ${allyClass} ${isClickedClass} ${isClickableClass} ${hideClass}`} onClick={onClick}>
			{
				show &&
				<>
          <div className={`${ccc}__type`}>
            <TypeSymbol
            type={type}
            />
          </div>
					<div className={`${ccc}__values`}>
						{ instance.card.actions.map((action, index) => (
              <ActionSymbol
              key={index}
              action={action}
              />
            ))}
					</div>
					<div className={`${ccc}__name`}>
						{instance.card.name}
					</div>
					<div className={`${ccc}__image`}>

					</div>
					<div className={`${ccc}__text`}>
						{instance.card.text}
					</div>
				</>
			}
			</div>
		)
	}
}
