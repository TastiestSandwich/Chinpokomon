import React from 'react';
import { render } from 'react-dom';
import { Game } from './views/game/game';
import { Start } from './views/start/start';
import { TeamBuilder, getRandomTeam } from './views/teamBuilder/teamBuilder';
import { DeckBuilder } from './views/deckBuilder/deckBuilder';
import { CardViewer } from './views/cardViewer/cardViewer';
import { CardInstance, getCardInstance, CardSource } from './components/card/card';
import { ChinpokoData } from './components/chinpoko/chinpoko';
import { PowerList } from './data/powerList';
import { ChinpokoCardList } from './data/chinpokoCardList'
import { Constants } from './data/const';

export const enum AppView {
  START,
  DECK,
  TEAM,
  GAME,
  CARDVIEWER
}

export function getPowerList(team: {[id: number] : ChinpokoData}) : {[id: number] : CardInstance} {
  let powerList: {[id: number] : CardInstance} = {};
  let id = 0;
  powerList[id] = getCardInstance(id, PowerList["Change"], false, false, CardSource.POWER, 0);

  for(let chinpokoId of Object.keys(team)){
    id++;
    let chinpoko = team[chinpokoId]
    powerList[id] = getCardInstance(id, chinpoko.storedData.species.power, false, false, CardSource.POWER, Number(chinpokoId));
    chinpoko.powerId = id;
  }
  return powerList;
}

export function getDeckList(team: {[id: number] : ChinpokoData}) : {[id: number] : CardInstance} {
  let deckList: {[id: number] : CardInstance} = {}
  let id = 1

  for(let card of ChinpokoCardList["TRAINER"]) {
    deckList[id] = getCardInstance(id, card.card, true, false, CardSource.DECK, 0)
    id++
  }

  for(let chinpoko of Object.values(team)) {
    for(let card of ChinpokoCardList[chinpoko.storedData.species.speciesName]) {
      deckList[id] = getCardInstance(id, card.card, true, false, CardSource.DECK, chinpoko.id)
      id++
    }
  }

  return deckList
}

export function getRandomDeck(deckList: {[id: number] : CardInstance}, team: {[id: number] : ChinpokoData}) : Array<number> {
  const len = Constants.maxCardsFromChinpoko
  const randomDeck: Array<number> = []

  let trainerCards: Array<number> = Object.values(deckList).filter(card => card.chinpokoId === 0).map(card => card.id)
  for(let i = 0; i < len; i++) {
    let randomIndex = Math.floor(Math.random() * trainerCards.length)
    randomDeck.push(trainerCards[randomIndex])
    trainerCards.splice(randomIndex, 1)
  }

  for(let chinpokoId of Object.keys(team)) {
    let chinpokoCards: Array<number> = Object.values(deckList).filter(card => card.chinpokoId === Number(chinpokoId)).map(card => card.id)
    for(let i = 0; i < len; i++) {
      let randomIndex = Math.floor(Math.random() * chinpokoCards.length)
      randomDeck.push(chinpokoCards[randomIndex])
      chinpokoCards.splice(randomIndex, 1)
    }
  }

  return randomDeck
}

interface AppState {
  allyTeam: {[id: number] : ChinpokoData}
  enemyTeam: {[id: number] : ChinpokoData}
  allyDeckList: {[id: number] : CardInstance}
  enemyDeckList: {[id: number] : CardInstance}
  allyPowerList: {[id: number] : CardInstance}
  enemyPowerList: {[id: number] : CardInstance}
  allyDeck: Array<number>
  enemyDeck: Array<number>
  view: AppView
  ally: boolean
  antiCheat: boolean
  cyborg: boolean
}

class App extends React.Component<{}, AppState> {
  constructor(props) {
    super(props);

    let allyTeam = getRandomTeam(Constants.maxChinpokos);
    let enemyTeam = getRandomTeam(Constants.maxChinpokos);
    let allyDeckList = getDeckList(allyTeam)
    let enemyDeckList = getDeckList(enemyTeam)
    let allyPowerList = getPowerList(allyTeam)
    let enemyPowerList = getPowerList(enemyTeam)
    let allyDeck = getRandomDeck(allyDeckList, allyTeam)
    let enemyDeck = getRandomDeck(enemyDeckList, enemyTeam)

    this.state = {
      view: AppView.START,
      allyTeam: allyTeam,
      enemyTeam: enemyTeam,
      allyDeckList: allyDeckList,
      enemyDeckList: enemyDeckList,
      allyDeck: allyDeck,
      enemyDeck: enemyDeck,
      allyPowerList: allyPowerList,
      enemyPowerList: enemyPowerList,
      ally: true,
      antiCheat: false,
      cyborg: false
    };
  }

  toggleAntiCheat = () => {
    this.setState((state) => ({
      antiCheat: !state.antiCheat
    }))
  }

  toggleCyborg = () => {
    this.setState((state) => ({
      cyborg: !state.cyborg
    }))
  }

  setTeam = (team: {[id: number] : ChinpokoData}, ally: boolean) => {
    if(ally) {
      this.setState({
        allyTeam: team
      });
    } else {
      this.setState({
        enemyTeam: team
      })
    }
  }

  setDeckList = (deckList: {[id: number] : CardInstance}, ally: boolean) => {
    if(ally) {
      this.setState({
        allyDeckList: deckList
      });
    } else {
      this.setState({
        enemyDeckList: deckList
      })
    }
  }

  setDeck = (deck: Array<number>, ally: boolean) => {
    if(ally) {
      this.setState({
        allyDeck: deck
      })
    } else {
      this.setState({
        enemyDeck: deck
      })
    }
  }

  setPowerList = (powerList: {[id: number] : CardInstance}, ally: boolean) => {
    if(ally) {
      this.setState({
        allyPowerList: powerList
      });
    } else {
      this.setState({
        enemyPowerList: powerList
      })
    }
  }

  swapPlayers = () => {
    this.setState((state) => ({
      allyTeam: state.enemyTeam,
      enemyTeam: state.allyTeam,
      allyDeckList: state.enemyDeckList,
      enemyDeckList: state.allyDeckList,
      allyDeck: state.enemyDeck,
      enemyDeck: state.allyDeck,
      allyPowerList: state.enemyPowerList,
      enemyPowerList: state.allyPowerList,
      ally: !state.ally
    }));
  }

  changeView = (view: AppView) => {
    this.setState({
      view: view
    });
  }

	render() {
    const view = this.state.view;

    switch(view) {
      case AppView.START:
        return (
          <Start 
          changeView={this.changeView}
          swapPlayers={this.swapPlayers}
          antiCheat={this.state.antiCheat}
          toggleAntiCheat={this.toggleAntiCheat}
          ally={this.state.ally}
          cyborg={this.state.cyborg}
          toggleCyborg={this.toggleCyborg}
          />
        );

      case AppView.TEAM:
        return (
          <TeamBuilder 
          changeView={this.changeView} 
          setTeam={this.setTeam} 
          setDeckList={this.setDeckList}
          swapPlayers={this.swapPlayers}
          setPowerList={this.setPowerList}
          allyTeam={this.state.allyTeam} 
          enemyTeam={this.state.enemyTeam}
          ally={this.state.ally}/>
        );

      case AppView.GAME:
        return (
          <Game 
          allyTeam={this.state.allyTeam} 
          enemyTeam={this.state.enemyTeam}
          allyDeckList={this.state.allyDeckList}
          enemyDeckList={this.state.enemyDeckList}
          allyDeck={this.state.allyDeck}
          enemyDeck={this.state.enemyDeck}
          allyPowerList={this.state.allyPowerList}
          enemyPowerList={this.state.enemyPowerList}
          setTeam={this.setTeam}
          setDeckList={this.setDeckList}
          setPowerList={this.setPowerList}
          swapPlayers={this.swapPlayers}
          antiCheat={this.state.antiCheat}
          cyborg={this.state.cyborg}
          />
        );

      case AppView.DECK:
        return (
          <DeckBuilder
          changeView={this.changeView}
          swapPlayers={this.swapPlayers}
          setDeckList={this.setDeckList}
          allyDeckList={this.state.allyDeckList}
          allyDeck={this.state.allyDeck}
          allyTeam={this.state.allyTeam}
          setDeck={this.setDeck}
          ally={this.state.ally}/>
        );

      case AppView.CARDVIEWER:
        return (
          <CardViewer
          changeView={this.changeView}/>
        );
    }
	}
}

render(
  <App />,
  document.getElementById('root')
);