import React from 'react';
import './cyborg.scss';
import cyborgON from '../../images/cyborgON.png';
import cyborgOFF from '../../images/cyborgOFF.png';
import { PhaseData, setPhaseGroupData } from '../phase/phase';
import { ChinpokoData } from '../chinpoko/chinpoko';
import { CardInstance } from '../card/card';
import { findStab, findEffectiveness } from '../type/biome';
import { Type } from '../type/type'

interface Evaluation {
  card: CardInstance
  adjustedPower: number
  totalPhases: number
}

function newEvaluation(card: CardInstance): Evaluation {
  return ({
    card: card,
    adjustedPower: 0,
    totalPhases: 0
  })
}

export function getCyborgPhases(phases: Array<PhaseData>, cyborgChinpoko: ChinpokoData, playerChinpoko: ChinpokoData, 
                                hand: Array<CardInstance>, chinpokoPower: CardInstance, cyborgPower: CardInstance) : Array<PhaseData> 
{
  // add powers to card array
  hand.push(chinpokoPower)
  hand.push(cyborgPower)

  const evalArray: Array<Evaluation> = []
  // evaluate in isolation each card in array
  for (let card of hand) {
    let evaluation: Evaluation = evaluateCard(card, cyborgChinpoko, playerChinpoko)
    evalArray.push(evaluation)
  }

  // do knapsack to figure out most valuable way of filling phases
  const resultArray: Array<Evaluation> = knapSack(phases.length, evalArray, evalArray.length)

  // fill out phases
  let phaseNumber: number = 1
  for(let ev of resultArray) {
    console.log("Adding card " + ev.card.card.name + " with action length " + ev.totalPhases + " to phaseNumber " + phaseNumber)
    phases = setPhaseGroupData(phaseNumber, ev.card, phases)
    phaseNumber = phaseNumber + ev.totalPhases
  }

  return phases
}

function evaluateCard(card: CardInstance, cyborgChinpoko: ChinpokoData, playerChinpoko: ChinpokoData) : Evaluation {
  const evaluation: Evaluation = newEvaluation(card)
  evaluation.totalPhases = card.card.actions.length

  for (let action of card.card.actions) {
    if (action.parameters.power) {
      let adjustedPower: number = getAdjustedPower(action.parameters.power, card.card.type, cyborgChinpoko, playerChinpoko)
      evaluation.adjustedPower = evaluation.adjustedPower + adjustedPower
    }
    if (action.parameters.percentage) {
      let adjustedPercentage: number = getAdjustedPower(action.parameters.percentage, card.card.type, cyborgChinpoko, playerChinpoko)
      evaluation.adjustedPower = evaluation.adjustedPower + adjustedPercentage * 10
    }
    if (action.effect.name != "WAIT") {
      evaluation.adjustedPower = evaluation.adjustedPower + 1
    }
  }
  console.log("card " + card.card.name + " has adjustedPower " + evaluation.adjustedPower)
  return evaluation
}

function getAdjustedPower(power: number, type: Type, cyborgChinpoko: ChinpokoData, playerChinpoko: ChinpokoData) : number {
  return power * findStab(type, cyborgChinpoko.storedData.species.biome) * findEffectiveness(type, playerChinpoko.storedData.species.biome)
}

function max(a: number, b: number): number{
  return a > b ? a : b
}

function matrix2D(rows: number, columns: number, value: number): Array<Array<number>> {
  return Array(rows).fill(undefined).map(()=>Array(columns).fill(value))
}

// knapsack with item picking from https://www.geeksforgeeks.org/printing-items-01-knapsack/
function knapSack(W: number, evs: Array<Evaluation>, n: number): Array<Evaluation> {
  // initialize
  let i:number, w:number
  const K: Array<Array<number>> = matrix2D(n+1, W+1, 0)

  // Build table K[][] in bottom up manner 
  for(i = 0; i <= n; i++) {
    for (w = 0; w <= W; w++) { 
      if (i === 0 || w === 0) {
        K[i][w] = 0
      } else {
        let ev: Evaluation = evs[i-1]
        if (ev.totalPhases <= w) {
          K[i][w] = max(ev.adjustedPower + K[i-1][w-ev.totalPhases], K[i-1][w])
        } else {
          K[i][w] = K[i-1][w]
        }
      }
    }
  }

  // stores the result of Knapsack
  let res: number = K[n][W]
  console.log("max adjusted power is " + res)

  const result: Array<Evaluation> = []
  w = W
  for(i = n; i > 0 && res > 0; i--) {
    // either the result comes from the top 
    // (K[i-1][w]) or from (val[i-1] + K[i-1] 
    // [w-wt[i-1]]) as in Knapsack table. If 
    // it comes from the latter one/ it means 
    // the item is included. 
    if (res === K[i-1][w]) {
      continue
    } else {
      // This item is included.
      let ev: Evaluation = evs[i-1]
      result.push(ev)
      // Since this weight is included its 
      // value is deducted 
      res = res - ev.adjustedPower
      w = w - ev.totalPhases
    }
  }
  return result
}

interface CyborgProps {
  onClick: () => void
  clicked: boolean
}

export class Cyborg extends React.Component<CyborgProps> {

  render() {
    const isClickable = !this.props.clicked
    const isClickableClass = isClickable ? `cyborg-component--is-clickable` : ""
    const sprite = isClickable ? cyborgOFF : cyborgON
    return (
      <div className={`cyborg-component ${isClickableClass}`} onClick={this.props.onClick}>
        <div className={`cyborg-component cyborg-component__sprite `}>
          <img src={sprite} alt="Cyborg Aslo"/>
        </div>
      </div>
    )
  }
}