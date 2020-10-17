import React from 'react';
import './card.scss';
import { GameStage } from '../../views/game/game';
import { Type, TypeSymbol } from '../type/type';
import { CardList } from '../../data/cardList';
import { CardAction, ActionSymbol, ActionEffect, ActionParameters } from '../action/action';

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
  isTemporal: boolean
  chinpokoId: number | null
}

export interface CardData {
  name: string
  text: string
  type: Type
  actions: Array<CardAction>
}

export function swapCardAction(card: CardInstance, oldEffect: ActionEffect, newEffect: ActionEffect, newParameters: ActionParameters) {
	let actions: Array<CardAction> = []
	for(let action of card.card.actions) {
		let newAction: CardAction = {
			effect: action.effect,
			parameters: action.parameters
		}
		if(action.effect.name === oldEffect.name) {
			newAction.effect = newEffect
			newAction.parameters = newParameters
		}
		actions.push(newAction)
	}
	let newCardData: CardData = {
		name: card.card.name,
		text: card.card.text,
		type: card.card.type,
		actions: actions
	}
	let newCard: CardInstance = {
		card: newCardData,
		id: card.id,
		isClicked: card.isClicked,
		isRemovable: card.isRemovable,
		source: card.source,
		isTemporal: card.isTemporal,
		chinpokoId: card.chinpokoId
	}
	return newCard
}

export function swapCardType(card: CardInstance, type: Type){
	card.card.type = type
	return card
}

export function getNumberOfDiscardableCards(hand: Array<number>, deckList: {[id: number] : CardInstance}): number {
	return hand.map(a => deckList[a]).filter(card => isCardDiscardable(card)).length
}

export function isCardDiscardable(card: CardInstance): boolean {
	return !card.isClicked && card.isRemovable
}

function getRandomCard() {
	let index = Math.floor(Math.random() * Object.values(CardList).length);
	return Object.values(CardList)[index];
}

export function getRandomCardInstance(id: number) {
	const card = getRandomCard();
	const instance = getCardInstance(id, card, true, false, CardSource.DECK, null);
	return instance
}

export function getCardInstance(id: number, card: CardData, isRemovable: boolean, isTemporal: boolean, source: CardSource, chinpokoId: number | null) {
	const instance: CardInstance = {
		card: card,
		id: id,
		isClicked: false,
		isRemovable: isRemovable,
    source: source,
    isTemporal: isTemporal,
    chinpokoId: chinpokoId
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
