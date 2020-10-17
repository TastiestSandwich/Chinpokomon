import React from 'react';
import '../../old_style/phase.css';
import { GameStage } from '../../views/game/game';
import { CardInstance } from '../card/card';
import { CardAction, ActionSymbol } from '../action/action';
import { Constants } from '../../data/const';

export interface CurrentPhase {
	isAlly: boolean
	index: number
}

export interface PhaseCounter {
  value: number
  isAlly: boolean
  remainingPhases: Array<PhaseData>
}

export function findHighestIndexOverLimit(phaseCounters: Array<PhaseCounter>, limit: number): number {
	let index: number = -1;
	let max: number = -1;

	for(let i = 0; i < phaseCounters.length; i++) {
		const value = phaseCounters[i].value;

		if (value > limit) {
			if ( (value > max) || (value === max && index < 0) ) {
				max = value;
				index = i;

			} else if (value === max && index >= 0) {
				const random = Math.random();
				if (random >= 0.5) {
					index = i;
				}
			}
		}
	}
	return index;
}

export function getPhaseGroupAmount(turn: number, storedPhases: number): number {
	let regularPhases: number = getPhaseGroupRegularAmount(turn)
	return regularPhases + storedPhases
}

function getPhaseGroupRegularAmount(turn: number): number {
	let regularPhases: number = Constants.startingPhases + (turn - 1) * Constants.phasesPerTurn
	return regularPhases > Constants.maxRegularPhases ? Constants.maxRegularPhases : regularPhases
}

export function initPhaseGroupData(size: number): Array<PhaseData> {
	let phaseGroup: Array<PhaseData> = new Array<PhaseData>();
	for (let i = 0; i < size; i++) {
		phaseGroup.push(initPhaseData(i+1));
	}
	return phaseGroup;
}

export function initPhaseData(index: number): PhaseData {
	let phaseData: PhaseData = {
		index: index,
		show: false,
		instance: null,
		action: null,
		isStart: false,
		isEnd: false
	}
	return phaseData;
}

export function shouldPhaseBeClicked(phaseNumber: number, instance: CardInstance | null, phases: Array<PhaseData>): boolean {
	if (instance === null){
		console.log("no card selected");
		return false;
	}
	const indexStart = phaseNumber - 1;
	const indexEnd = indexStart + instance.card.actions.length;
	for (let i = indexStart; i < indexEnd; i++) {
		// check if phase exists
		if (phases[i] == undefined) {
			return false;
		}
		// check if card action is empty, or phase action is null or empty
		let isEmpty = (phases[i].action === null || phases[i].action?.effect.name === "EMPTY")
									|| instance.card.actions[i - indexStart]?.effect.name === "EMPTY"
		if (!isEmpty) {
			console.log("not enough unfilled phases")
			return false;
		}
	}
	return true;
}

export function setPhaseGroupData(phaseNumber: number, instance: CardInstance | null, phases: Array<PhaseData>): Array<PhaseData> {
	let newPhases: Array<PhaseData> = phases.slice();
	if (instance === null) {
		return newPhases;
	}
	const phaseIndex = phaseNumber - 1;
	const length = instance.card.actions.length;
	let startFound: boolean = false
	for (let i = 0; i < length; i++) {
		let index = phaseIndex + i
		let action = instance.card.actions[i]
		let isEmpty = action.effect.name === "EMPTY"
		if(!isEmpty) {
			newPhases[index] = {
				index: index + 1,
				show: false,
				instance: instance,
				action: action,
				isStart: !startFound,
				isEnd: i === length - 1
			}
			startFound = true
		}
	}
	return newPhases;
}

export function deleteFromPhaseGroupData(instance: CardInstance, phases: Array<PhaseData>): Array<PhaseData> {
	let newPhases: Array<PhaseData> = phases.slice();
	for (let i = 0; i < newPhases.length; i++) {
		const localInstance = newPhases[i].instance;
		if(localInstance != null && localInstance.id === instance.id) {
			newPhases[i] = {
				index: i+1,
				show: false,
				instance: null,
				action: null,
				isStart: false,
				isEnd: false
			}
		}
	}
	return newPhases;
}

interface PhaseGroupProps {
	phases: Array<PhaseData>
	ally: boolean
	stage: GameStage
	currentPhase: CurrentPhase | null
	antiCheat: boolean
	turn: number
	onPhaseClick?: (phaseNumber: number) => void
	onPhaseDelete?: (phaseNumber: number, instance: CardInstance | null) => void
}

interface PhaseGroupState {
	hover: boolean
}

export class PhaseGroup extends React.Component<PhaseGroupProps, PhaseGroupState> {
	constructor(props) {
    super(props);
    this.state = {
      hover: false
    };
  }
	handleClick = (phaseNumber: number) => () => {
		if (this.props.onPhaseClick)
			this.props.onPhaseClick(phaseNumber)
	}
	handleDelete = (phaseNumber: number, instance: CardInstance | null) => () => {
		if (this.props.onPhaseDelete)
			this.props.onPhaseDelete(phaseNumber, instance)
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
		const allyText = this.props.ally?"ALLY":"ENEMY";
		return (
			<div className="phase-group" onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut}>
				{allyText}
				{ this.props.phases.map((phase, index) => (
				  <Phase
					key={index}
					phase={phase}
					ally={this.props.ally}
					stage={this.props.stage}
					currentPhase={this.props.currentPhase}
					onPhaseClick={this.handleClick(index+1)}
					onPhaseDelete={this.handleDelete(index+1, phase.instance)}
					groupHover={this.state.hover}
					antiCheat={this.props.antiCheat}
					turn={this.props.turn}
				   />
				  ))}
			</div>
		)
	}
}

export interface PhaseData {
	index: number
	show: boolean
	action: CardAction | null
	instance: CardInstance | null
	isStart: boolean
	isEnd: boolean
}

interface PhaseProps {
	key: number
	phase: PhaseData
	ally: boolean
	stage: GameStage
	currentPhase: CurrentPhase | null
	groupHover: boolean
	antiCheat: boolean
	turn: number
	onPhaseClick?: () => void
	onPhaseDelete?: () => void
}

export class Phase extends React.Component<PhaseProps, {}> {

	render() {
		const { phase, ally, stage, currentPhase, onPhaseClick, onPhaseDelete, turn } = this.props;

		let isCurrent = false;
		if (currentPhase != null) {
			isCurrent = (ally === currentPhase.isAlly && phase.index === currentPhase.index);
		}
		const currentClass = isCurrent ? "is-current" : ""
		// add is-not-ally class after ':' if needed
		const allyClass = ally ? "is-ally" : ""
		const filledClass = phase.action ? "is-filled" : ""

		// show if antiCheat is off, or when hovered
		const showByAntiCheat = !this.props.antiCheat || this.props.groupHover
		const showCondition = phase.show || ( ally && stage === GameStage.PLAY && showByAntiCheat )
		const showClass = phase.show ? "is-show" : ""

		const extraClass = phase.index > getPhaseGroupRegularAmount(turn) ? "is-extra" : ""

		if(!showCondition) {
			return (
				<div className={`phase-container ${allyClass}`}>
					<div className={`phase ${extraClass}`}>
						{phase.index}
					</div>
				</div>
			)

		} else {
			return (
				<div className={`phase-container ${allyClass} ${currentClass} ${showClass}`}>
					<div className={`phase ${filledClass} ${extraClass}`} onClick={onPhaseClick}>
						<div className={"phase-text"}>
							{phase.index}
						</div>
						{ phase.action &&
							<div className={"phase-symbol"}>
								<ActionSymbol
								action={phase.action}
								/>
							</div> }
					</div>
					{ phase.instance != null && phase.isStart &&
						<div className="phase-card">
							{phase.instance.card.name}
							<button className="delete-phase-card" onClick={onPhaseDelete}>
								x
							</button>
						</div> }
				</div>
			)
		}
	}
}