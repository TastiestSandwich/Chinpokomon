import React from 'react';
import './deckBuilder.scss';
import { AppView } from '../../app';
import { CardInstance } from '../../components/card/card';
import { ChinpokoData, ChinpokoSprite } from '../../components/chinpoko/chinpoko'
import { DeckCard } from '../deckBuilder/deckCard';
import { TabButton } from './tabButton'

interface DeckBuilderProps {
  changeView: (view: AppView) => void
  setDeckList: (deckList: {[id: number] : CardInstance}, ally: boolean) => void
  swapPlayers: () => void
  allyDeckList: {[id: number] : CardInstance}
  allyTeam: {[id: number] : ChinpokoData}
  ally: boolean
  allyDeck: Array<number>
  setDeck: (deck: Array<number>, ally: boolean) => void
}

interface DeckBuilderState {
  selectedTab: number
}

export class DeckBuilder2 extends React.Component<DeckBuilderProps, DeckBuilderState> {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: -1
    }
  }

  handleChangePlayer = () => {
    this.props.swapPlayers();
  }

  changeViewToStart = () => {
    this.props.changeView(AppView.START);
  }

  handleChangeTab = (tab: number) => () => {
    this.setState({
      selectedTab: tab
    })
  }

  handleCardClick = (id: number) => (selected: boolean) => () => {
    let deck: Array<number>
    if(selected) {
      deck = this.props.allyDeck.filter(cardId => cardId != id)
    } else {
      deck = this.props.allyDeck
      deck.push(id)
    }
    this.props.setDeck(deck, true)
  }

  renderTab(tab: number){
    let instances: Array<CardInstance> = []
    if(tab === -1) {
      instances = this.props.allyDeck.map(id => this.props.allyDeckList[id])
    } else {
      instances = Object.values(this.props.allyDeckList).filter(card => card.chinpokoId === tab)
    }

    return (
      <div className="deck-builder2-component__deck">
      { instances.map((card) => (
        <DeckCard
          key={card.id}
          instance={card}
          isSelected={this.props.allyDeck.includes(card.id)}
          onClick={this.handleCardClick(card.id)}
         />
        ))}
     </div>
    )
  }

  render(){
    const player = this.props.ally ? "PLAYER 1" : "PLAYER 2";
    const chinpokoKeys = Object.keys(this.props.allyTeam)

  	return (
  		<div className="deck-builder2-component">
        <button className="deck-builder2-component__start-button" onClick={this.changeViewToStart}>
          BACK
        </button>
  			<div className="deck-builder2-component__title">
  				DECK BUILDER
  			</div>
        <div className="deck-builder2-component__subtitle">
          <div className="deck-builder2-component__player">
            {player}
          </div>
          <button className="deck-builder2-component__player-button" onClick={this.handleChangePlayer}>
            CHANGE PLAYER
          </button>
        </div>
        <div className="deck-builder2-component__tab-button-row">
          <TabButton onClick={this.handleChangeTab(-1)} isClicked={-1 === this.state.selectedTab}>
            <div className="deck-builder2-component__tab-button-title">
              MY DECK
            </div>
          </TabButton>
          <TabButton onClick={this.handleChangeTab(0)} isClicked={0 === this.state.selectedTab}>
            <div className="deck-builder2-component__tab-button-title">
              TRAINER
            </div>
          </TabButton>
          { chinpokoKeys.map((key) => (
            <TabButton onClick={this.handleChangeTab(Number(key))} isClicked={Number(key) === this.state.selectedTab}>
              <ChinpokoSprite chinpoko={this.props.allyTeam[key]} baseClass="tab-button-component"/>
            </TabButton>
            ))}
        </div>
        { this.renderTab(this.state.selectedTab) }
  		</div>
	  )
  }
}