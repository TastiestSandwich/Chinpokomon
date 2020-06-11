import React from 'react';
import { AppView } from '../../app';

interface StartProps {
  changeView: (view: AppView) => void
  swapPlayers: () => void
  antiCheating: boolean
  toggleAntiCheating: () => void
  ally: boolean
}

const allyName = "COFFEE BOI"
const rivalName = "ASLO"

export class Start extends React.Component<StartProps> {
  changeViewToGame = () => {
    this.props.changeView(AppView.GAME);
  }
  changeViewToTeam = () => {
    this.props.changeView(AppView.TEAM);
  }
  changeViewToDeck = () => {
    this.props.changeView(AppView.DECK);
  }

	render() {
    const playerName : string = this.props.ally ? allyName : rivalName
    const otherName : string = this.props.ally ? rivalName : allyName
    const playerString : string = "YOU ARE " + playerName
    const swapString : string = "CHANGE TO " + otherName

    return(
      <div className="start-component">
        <div className="start-component__title">
          ARE YOU READY TO BECOME A CHINPOKOMON MASTER
        </div>
        <div className="start-component__menu-zone">
          <button className="start-component__game-button" onClick={this.changeViewToGame}>
            GAME
          </button>
          <button className="start-component__team-button" onClick={this.changeViewToTeam}>
            TEAM
          </button>
          <button className="start-component__deck-button" onClick={this.changeViewToDeck}>
            DECK
           </button>
         </div>
         <div className="start-component__player-zone">
           <div className="start-component__player-message">
             { playerString }
           </div>
           <button className="start-component__player-swap-button" onClick={this.props.swapPlayers}>
             { swapString }
           </button>
         </div>
         <div className="start-component__options-zone">
           <div className="start-component__anticheat-message">
             ACTIVATE ANTICHEAT?
           </div> 
           <input type="checkbox" checked={this.props.antiCheating} onChange={this.props.toggleAntiCheating}/>
         </div>
      </div>
    );
	}
}