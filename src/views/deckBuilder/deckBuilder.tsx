import React from 'react';
import './deckBuilder.scss';
import { AppView } from '../../app';
import { CardInstance, getRandomCardInstance, getCardInstance, CardData, CardSource } from '../../components/card/card';
import { CardList } from '../../data/cardList';
import { DeckCard } from './deckCard';

export function getRandomDeckList(size: number) {
  let deckList: {[id: number] : CardInstance} = {};
  for(let i=0; i < size; i++) {
    deckList[i] = getRandomCardInstance(i);
  }
  return deckList;
}

function transformInputToDeckList(inputArray: Array<string>): {[id: number] : CardInstance} {
  const deckList: {[id: number] : CardInstance} = {};
  for(let i=0; i < inputArray.length; i++) {
    const card: CardData = CardList[inputArray[i]];
    deckList[i] = getCardInstance(i, card, true, false, CardSource.DECK);
  }
  return deckList;
}

function transformDeckListToInput(deckList: {[id: number] : CardInstance}) {
  const input: Array<String> = [];
  for(let instance of Object.values(deckList)) {
    input.push( instance.card.name );
  }
  return input;
}

interface DeckBuilderProps {
  changeView: (view: AppView) => void
  setDeckList: (deckList: {[id: number] : CardInstance}, ally: boolean) => void
  swapPlayers: () => void
  allyDeckList: {[id: number] : CardInstance}
  enemyDeckList: {[id: number] : CardInstance}
  ally: boolean
}

interface DeckBuilderState {
  message: string
  input: string
}

export class DeckBuilder extends React.Component<DeckBuilderProps, DeckBuilderState> {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      input: JSON.stringify( transformDeckListToInput(this.props.allyDeckList) ),
    }
  }

  handleChangePlayer = () => {
    const deckList = this.props.enemyDeckList;
    this.setState(prevState => ({
      input: JSON.stringify( transformDeckListToInput(deckList) )
    }));
    this.props.swapPlayers();
  }

  handleInput = (event) => {
    this.setState({
      input: event.target.value,
      message: ""
    })
  }

  handleSubmit = () => {
    const input = JSON.parse(this.state.input);
    this.props.setDeckList( transformInputToDeckList(input), true );
    this.setState({
      message: "Deck submitted successfully!"
    })
  }

  changeViewToStart = () => {
    this.props.changeView(AppView.START);
  }

  render(){
    const player = this.props.ally ? "PLAYER 1" : "PLAYER 2";
    const deckList = this.props.allyDeckList;
    const cardKeys = Object.keys(deckList);

  	return (
  		<div className="deck-builder-component">
        <button className="deck-builder-component__start-button" onClick={this.changeViewToStart}>
          BACK
        </button>
  			<div className="deck--component__title">
  				DECK BUILDER
  			</div>
        <div className="deck-builder-component__subtitle">
          <div className="deck-builder-component__player">
            {player}
          </div>
          <button className="deck-builder-component__player-button" onClick={this.handleChangePlayer}>
            CHANGE PLAYER
          </button>
        </div>
        <div className="deck-builder-component__deck">
          { cardKeys.map((key) => (
          <DeckCard
            key={key}
            instance={deckList[key]}
           />
          ))}
        </div>
        <div className="deck-builder-component__body">
          <button className="deck-builder-component__submit-button" onClick={this.handleSubmit}>
            SUBMIT
          </button>
          <textarea className="deck-builder-component__input" onChange={this.handleInput} value={this.state.input}>
          </textarea>
        </div>
        <div className="deck-builder-component__message">
          {this.state.message}
        </div>
  		</div>
	  )
  }
}