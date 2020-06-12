import React from 'react';
import './hand.scss';
import { GameStage } from '../../views/game/game';
import Card, { CardInstance } from '../card/card';

interface HandProps {
	instances: Array<CardInstance>
	ally: boolean
  stage: GameStage
	onCardClick?: (instance: CardInstance) => void
	className?: string
	antiCheat: boolean
}

interface HandState {
	hover: boolean
}

export class Hand extends React.Component<HandProps, HandState> {
	constructor(props) {
    super(props);
    this.state = {
      hover: false
    };
  }

	handleClick = (instance: CardInstance) => () => {
		if(this.props.onCardClick)
			this.props.onCardClick(instance)
	}
	handleMouseOver = () => {
		this.setState({
			hover: true
		})
	}
	handleMouseOut = () => {
		this.setState({
			hover: false
		})
	}

	render() {
		const {instances, ally, className} = this.props
		// add is-not-ally class after ':' if needed
		const allyClass = ally ? "is-ally" : "is-enemy"
		const onClick = ally ?
						this.handleClick ?
							this.handleClick
							: (a) => {return undefined}
						: (a) => {return undefined}
		return (
			<div className={`hand-component hand-component--${allyClass} ${className}`} 
			onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut}>
				{ instances.map((instance) => (
					<Card
						key={instance.id}
						instance={instance}
						ally={this.props.ally}
            stage={this.props.stage}
						onClick={onClick(instance)}
						handHover={this.state.hover}
						antiCheat={this.props.antiCheat}
					 />
					))}
			</div>
		);
	}
}

interface SelectedCardProps {
	instance: CardInstance
  stage: GameStage
	deleteCardClick?: () => void
}

export class SelectedCard extends React.Component<SelectedCardProps> {
	deleteCardClick = () => () => {
		if(this.props.deleteCardClick)
			this.props.deleteCardClick()
	}

	render() {
		const instance = this.props.instance
		return (
			<div className = "selected-card">
				{
					instance &&
					<Card instance={instance} ally={true} stage={this.props.stage}
					handHover={false}
					antiCheat={false}/>
				}
				{
					instance &&
					<button className="delete-button" onClick={this.deleteCardClick()}> X </button>
				}
			</div>
		)
	}
}