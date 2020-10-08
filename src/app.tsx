import React from 'react';
import { render } from 'react-dom';
import { Game } from './views/game/game';
import { Start } from './views/start/start';
import { TeamBuilder, getRandomTeam } from './views/teamBuilder/teamBuilder';
import { DeckBuilder, getRandomDeckList } from './views/deckBuilder/deckBuilder';
import { DeckBuilder2 } from './views/deckBuilder2/deckBuilder2';
import { CardViewer } from './views/cardViewer/cardViewer';
import { CardInstance, getCardInstance, CardSource } from './components/card/card';
import { ChinpokoData } from './components/chinpoko/chinpoko';
import { PowerList } from './data/powerList';

export const enum AppView {
  START,
  DECK,
  TEAM,
  GAME,
  DECK2,
  CARDVIEWER
}

export function getPowerList(team: {[id: number] : ChinpokoData}) : {[id: number] : CardInstance} {
  let powerList: {[id: number] : CardInstance} = {};
  let id = 0;
  powerList[id] = getCardInstance(id, PowerList["Change"], false, false, CardSource.POWER);

  for(let chinpoko of Object.values(team)){
    id++;
    powerList[id] = getCardInstance(id, chinpoko.storedData.species.power, false, false, CardSource.POWER);
    chinpoko.powerId = id;
  }
  return powerList;
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

    let allyTeam = getRandomTeam(4);
    let enemyTeam = getRandomTeam(4);
    let allyDeckList = getRandomDeckList(30);
    let enemyDeckList = getRandomDeckList(30);
    let allyPowerList = getPowerList(allyTeam);
    let enemyPowerList = getPowerList(enemyTeam);
    let allyDeck = Object.keys(allyDeckList).map(a => Number(a))
    let enemyDeck = Object.keys(enemyDeckList).map(a => Number(a))

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

      case AppView.DECK:
        return (
          <DeckBuilder 
          changeView={this.changeView}
          swapPlayers={this.swapPlayers}
          setDeckList={this.setDeckList}
          allyDeckList={this.state.allyDeckList}
          enemyDeckList={this.state.enemyDeckList}
          ally={this.state.ally}/>
        );

      case AppView.TEAM:
        return (
          <TeamBuilder 
          changeView={this.changeView} 
          setTeam={this.setTeam} 
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

      case AppView.DECK2:
        return (
          <DeckBuilder2
          changeView={this.changeView}
          swapPlayers={this.swapPlayers}
          setDeckList={this.setDeckList}
          allyDeckList={this.state.allyDeckList}
          enemyDeckList={this.state.enemyDeckList}
          allyDeck={this.state.allyDeck}
          enemyDeck={this.state.enemyDeck}
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