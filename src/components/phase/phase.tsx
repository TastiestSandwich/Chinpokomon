import React from 'react';
import '../../old_style/phase.css';
import { GameStage } from '../../views/game/game';
import { CardInstance, CardAction } from '../card/card';

export interface CurrentPhase {
	isAlly: boolean
	index: number
}

export interface PhaseCounter {
  value: number
  isAlly: boolean
  remainingPhases: Array<PhaseData>
}

export function findHighestIndexOverLimit(phaseCounters: Array<PhaseCounter>, limit: number) {
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

export function initPhaseGroupData(size: number) {
	let phaseGroup: Array<PhaseData> = new Array<PhaseData>();
	for (let i = 0; i < size; i++) {
		phaseGroup.push(initPhaseData(i+1));
	}
	return phaseGroup;
}

export function initPhaseData(index: number) {
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

export function shouldPhaseBeClicked(phaseNumber: number, instance: CardInstance | null, phases: Array<PhaseData>) {
	if (instance === null){
		console.log("no card selected");
		return false;
	}
	for (let i = phaseNumber - 1; i < instance.card.actions.length; i++) {
		if (phases[i] == null || phases[i].action) {
			console.log("not enough unfilled phases")
			return false;
		}
	}
	return true;
}

export function setPhaseGroupData(phaseNumber: number, instance: CardInstance | null, phases: Array<PhaseData>) {
	let newPhases: Array<PhaseData> = phases.slice();
	if (instance === null) {
		return newPhases;
	}
	const phaseIndex = phaseNumber - 1;
	const length = instance.card.actions.length;
	for (let i = 0; i < length; i++) {
		let index = phaseIndex + i
		newPhases[index] = {
			index: index + 1,
			show: false,
			instance: instance,
			action: instance.card.actions[i],
			isStart: i === 0 ? true : false,
			isEnd: i === length - 1 ? true : false
		}
	}
	return newPhases;
}

export function deleteFromPhaseGroupData(instance: CardInstance, phases: Array<PhaseData>) {
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
	onPhaseClick?: (phaseNumber: number) => void
	onPhaseDelete?: (phaseNumber: number, instance: CardInstance | null) => void
}

export class PhaseGroup extends React.Component<PhaseGroupProps, {}> {
	handleClick = (phaseNumber: number) => () => {
		if (this.props.onPhaseClick)
			this.props.onPhaseClick(phaseNumber)
	}
	handleDelete = (phaseNumber: number, instance: CardInstance | null) => () => {
		if (this.props.onPhaseDelete)
			this.props.onPhaseDelete(phaseNumber, instance)
	}

	render() {
		const allyText = this.props.ally?"ALLY":"ENEMY";
		return (
			<div className="phase-group">
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
	onPhaseClick?: () => void
	onPhaseDelete?: () => void
}

export class Phase extends React.Component<PhaseProps, {}> {

	render() {
		const { phase, ally, stage, currentPhase, onPhaseClick, onPhaseDelete } = this.props;

		let isCurrent = false;
		if (currentPhase != null) {
			isCurrent = (ally === currentPhase.isAlly && phase.index === currentPhase.index);
		}
		const currentClass = isCurrent ? "is-current" : ""
		// add is-not-ally class after ':' if needed
		const allyClass = ally ? "is-ally" : ""
		const filledClass = phase.action ? "is-filled" : ""
		const showCondition = phase.show || (ally && stage === GameStage.PLAY)
		const showClass = phase.show ? "is-show" : ""

		if(!showCondition) {
			return (
				<div className={`phase-container ${allyClass}`}>
					<div className="phase">
						{phase.index}
					</div>
				</div>
			)

		} else {
			return (
				<div className={`phase-container ${allyClass} ${currentClass} ${showClass}`}>
					<div className={`phase ${filledClass}`} onClick={onPhaseClick}>
						{phase.index}
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