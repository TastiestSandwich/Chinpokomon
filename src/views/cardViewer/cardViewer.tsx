import React from 'react';
import './cardViewer.scss';
import { AppView } from '../../app';
import { CardInstance, getCardInstance, CardSource } from '../../components/card/card';
import { CardList } from '../../data/cardList';
import { DeckCard } from '../deckBuilder/deckCard';

function getCardInstanceList(): {[id: number] : CardInstance} {
  let cardList: {[id: number] : CardInstance} = {}
  let i = 0
  for(let card of Object.values(CardList)) {
    cardList[i] = getCardInstance(i, card, true, true, CardSource.DECK)
    i++
  }
  return cardList
}

interface CardViewerProps {
  changeView: (view: AppView) => void
}

export class CardViewer extends React.Component<CardViewerProps> {
  changeViewToStart = () => {
    this.props.changeView(AppView.START);
  }

  render(){
    const cardList = getCardInstanceList()
    const cardKeys = Object.keys(cardList);

  	return (
  		<div className="card-viewer-component">
        <button className="card-viewer-component__start-button" onClick={this.changeViewToStart}>
          BACK
        </button>
  			<div className="card-viewer__title">
  				CARD VIEWER
  			</div>
        <div className="card-viewer-component__deck">
          { cardKeys.map((key) => (
          <DeckCard
            key={key}
            instance={cardList[key]}
           />
          ))}
        </div>
  		</div>
	  )
  }
}