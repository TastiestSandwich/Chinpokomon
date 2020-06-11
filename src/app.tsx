import React from 'react';
import { render } from 'react-dom';
import { Game } from './views/game/game';
import { Start } from './views/start/start';
import { TeamBuilder, getRandomTeam } from './views/teamBuilder/teamBuilder';
import { DeckBuilder, getRandomDeckList } from './views/deckBuilder/deckBuilder';
import { CardInstance, getCardInstance, CardSource } from './components/card/card';
import { ChinpokoData } from './components/chinpoko/chinpoko';
import { PowerList } from './data/powerList';

export const enum AppView {
  START,
  DECK,
  TEAM,
  GAME
}

function getPowerList(team: {[id: number] : ChinpokoData}) : {[id: number] : CardInstance} {
  let powerList: {[id: number] : CardInstance} = {};
  let id = 0;
  powerList[id] = getCardInstance(id, PowerList["Change"], false, CardSource.POWER);

  for(let chinpoko of Object.values(team)){
    id++;
    powerList[id] = getCardInstance(id, chinpoko.storedData.species.power, false, CardSource.POWER);
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
  view: AppView
  ally: boolean
  antiCheating: boolean
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

    this.state = {
      view: AppView.START,
      allyTeam: allyTeam,
      enemyTeam: enemyTeam,
      allyDeckList: allyDeckList,
      enemyDeckList: enemyDeckList,
      allyPowerList: allyPowerList,
      enemyPowerList: enemyPowerList,
      ally: true,
      antiCheating: false
    };
  }

  toggleAntiCheating = () => {
    this.setState((state) => ({
      antiCheating: !state.antiCheating
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
          antiCheating={this.state.antiCheating}
          toggleAntiCheating={this.toggleAntiCheating}
          ally={this.state.ally}
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
          allyPowerList={this.state.allyPowerList}
          enemyPowerList={this.state.enemyPowerList}
          setTeam={this.setTeam}
          setDeckList={this.setDeckList}
          setPowerList={this.setPowerList}
          swapPlayers={this.swapPlayers}
          antiCheating={this.state.antiCheating}
          />
        );
    }
	}
}

render(
  <App />,
  document.getElementById('root')
);