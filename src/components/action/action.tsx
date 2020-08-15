import React from 'react';
import './actionSymbol.scss';

export interface CardAction {
  effect: ActionEffect
  parameters: ActionParameters
}

export interface ActionEffect {
  name: string
  symbol: string
}

export interface ActionParameters {
  power?: number
  percentage?: number
  stat?: string
}

interface ActionSymbolProps {
  action: CardAction
}

export class ActionSymbol extends React.Component<ActionSymbolProps, {} > {
  render() {
    const action = this.props.action
    return(
      <div className={`action-symbol action-symbol--effect-${action.effect.name}`}>
        <div className={"action-symbol__icon"}>
          <i className={action.effect.symbol}></i>
        </div>
      </div>
    )
  }
}
