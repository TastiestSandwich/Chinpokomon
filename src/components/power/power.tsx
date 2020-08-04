import React from 'react';
import './power.scss';
import { GameStage } from '../../views/game/game';
import { TypeSymbol } from '../type/type';
import { ActionSymbol } from '../action/action';
import { CardInstance } from '../card/card';

interface PowerProps {
  instance: CardInstance
  stage: GameStage
  onClick?: () => void
  antiCheat: boolean
}

interface PowerState {
  hover: boolean
}

export default class Power extends React.Component<PowerProps,PowerState> {
  constructor(props) {
    super(props);
    this.state = {
      hover: false
    };
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
		const { instance, stage, onClick, } = this.props
		const type = instance.card.type
		const pcc = "power-component"

    const showByAntiCheat = !this.props.antiCheat || this.state.hover
    const show = showByAntiCheat
    const hideClass = show ? "" : `${pcc}--is-hide` 

    const isClickedClass = instance.isClicked && show ? `${pcc}--is-clicked` : ""
    const isClickableClass = stage == GameStage.PLAY && !!onClick && !instance.isClicked ? `${pcc}--is-clickable` : ""

		return(
			<div className={`${pcc} ${pcc}--type-${type.name} ${isClickedClass} ${isClickableClass} ${hideClass}`} onClick={onClick}
      onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut}>
			{
				show &&
				<>
          <div className={`${pcc}__type`}>
            <TypeSymbol
            type={type}
            />
          </div>
					<div className={`${pcc}__values`}>
						{ instance.card.actions.map((action, index) => (
              <ActionSymbol
              key={index}
              action={action}
              />
            ))}
					</div>
					<div className={`${pcc}__name`}>
						{instance.card.name}
					</div>
					<div className={`${pcc}__text`}>
						{instance.card.text}
					</div>
				</>
			}
			</div>
		)
	}
}