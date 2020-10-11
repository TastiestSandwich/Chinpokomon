import React from 'react';
import './deckBuilder.scss';
import { AppView } from '../../app';
import { CardInstance } from '../../components/card/card';
import { ChinpokoData } from '../../components/chinpoko/chinpoko'
import { DeckCard } from '../deckBuilder/deckCard';
import { TabButton } from './tabButton'
import { Constants } from '../../data/const'
import { Sprite } from '../../components/sprite/sprite';
import aslophd from '../../images/aslophd.png';
import coffeeboi from '../../images/coffeeboi.png';
import deck from '../../images/deck.png';

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

export class DeckBuilder extends React.Component<DeckBuilderProps, DeckBuilderState> {
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

  handleCardClick = (id: number, isMaxAmount: boolean) => (selected: boolean) => () => {
    let deck: Array<number>
    console.log("id " + id)
    console.log("isMaxAmount " + isMaxAmount)
    console.log("selected " + selected)
    if(selected) {
      deck = this.props.allyDeck.filter(cardId => cardId != id)
    } else if(!isMaxAmount) {
      deck = this.props.allyDeck
      deck.push(id)
    } else {
      return
    }
    this.props.setDeck(deck, true)
  }

  getAmountSelected(tab: number){
    let amount = this.props.allyDeck.map(id => this.props.allyDeckList[id]).filter(card => card.chinpokoId === tab).length
    return amount;
  }

  renderTab(tab: number){
    let instances: Array<CardInstance> = []
    if(tab === -1) {
      instances = this.props.allyDeck.map(id => this.props.allyDeckList[id])
    } else {
      instances = Object.values(this.props.allyDeckList).filter(card => card.chinpokoId === tab)
    }

    let isMaxAmount: boolean = this.getAmountSelected(tab) >= Constants.maxCardsFromChinpoko
    console.log(this.getAmountSelected(tab))

    return (
      <div className="deck-builder-component__deck">
      { instances.map((card) => (
        <DeckCard
          key={card.id}
          instance={card}
          isSelected={this.props.allyDeck.includes(card.id)}
          onClick={this.handleCardClick(card.id, isMaxAmount) }
         />
        ))}
     </div>
    )
  }

  render(){
    const player = this.props.ally ? Constants.allyName : Constants.rivalName;
    const playerSprite = this.props.ally ? coffeeboi : aslophd
    const chinpokoKeys = Object.keys(this.props.allyTeam)

  	return (
  		<div className="deck-builder-component">
        <button className="deck-builder-component__start-button" onClick={this.changeViewToStart}>
          BACK
        </button>
  			<div className="deck-builder-component__title">
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
        <div className="deck-builder-component__tab-button-row">
          <TabButton onClick={this.handleChangeTab(-1)} isClicked={-1 === this.state.selectedTab}
           amountSelected={this.props.allyDeck.length} maxAmount={Constants.maxCardsFromChinpoko * (1 + chinpokoKeys.length)}>
            <div className="deck-builder-component__tab-button-title">
              <div className="deck-builder-component__tab-button-title">
              <Sprite 
               sprite={deck} 
               altText="My Deck"
               baseClass="tab-button-component"/>
            </div>
            </div>
          </TabButton>
          <TabButton onClick={this.handleChangeTab(0)} isClicked={0 === this.state.selectedTab}
            amountSelected={this.getAmountSelected(0)} maxAmount={Constants.maxCardsFromChinpoko}>
            <div className="deck-builder-component__tab-button-title">
              <Sprite 
               sprite={playerSprite} 
               altText={player}
               baseClass="tab-button-component"/>
            </div>
          </TabButton>
          { chinpokoKeys.map((key) => (
            <TabButton onClick={this.handleChangeTab(Number(key))} isClicked={Number(key) === this.state.selectedTab}
            amountSelected={this.getAmountSelected(Number(key))} maxAmount={Constants.maxCardsFromChinpoko}>
              <Sprite 
               sprite={this.props.allyTeam[key].storedData.species.sprite} 
               altText={this.props.allyTeam[key].storedData.species.speciesName}
               baseClass="tab-button-component"/>
            </TabButton>
            ))}
        </div>
        { this.renderTab(this.state.selectedTab) }
  		</div>
	  )
  }
}