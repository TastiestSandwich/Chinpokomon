import React from 'react';
import './modal.scss';
import Card, { CardInstance } from '../../components/card/card';
import { GameStage } from '../../views/game/game';

interface ChooseCardProps {
  ally: boolean
  onCardClick: (id: number, ally: boolean) => void
  cards: {[id: number] : CardInstance}
  anticheat: boolean
}

interface ChooseCardState {
  hover: boolean
}

export default class ChooseCard extends React.Component<ChooseCardProps, ChooseCardState> {
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

  handleClick = (id:number) => () => {
    this.props.onCardClick(id, this.props.ally)
  }

  render() {
    const cards = this.props.cards
    const chinpokoKeys = Object.keys(cards);

    return(
      <div className="choose-card-component" onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut}>
        { chinpokoKeys.map((key) => (
          <Card
            key={key}
            instance={cards[key]}
            ally={true}
            stage={GameStage.PLAY}
            onClick={this.handleClick(parseInt(key))}
            antiCheat={this.props.anticheat}
            handHover={this.state.hover}
           />
          ))}
      </div>
    );
  }
}