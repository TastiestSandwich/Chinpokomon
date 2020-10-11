import React from 'react';
import { AppView } from '../../app';
import './start.scss';
import '../../root.scss';
import { Constants } from '../../data/const';

interface StartProps {
  changeView: (view: AppView) => void
  swapPlayers: () => void
  antiCheat: boolean
  toggleAntiCheat: () => void
  ally: boolean
  cyborg: boolean
  toggleCyborg: () => void
}

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
  changeViewToCardViewer = () => {
    this.props.changeView(AppView.CARDVIEWER)
  }

	render() {
    const playerName : string = this.props.ally ? Constants.allyName : Constants.rivalName
    const otherName : string = this.props.ally ? Constants.rivalName : Constants.allyName
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
          <button className="start-component__card-button" onClick={this.changeViewToCardViewer}>
            CARD VIEWER
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
           <input type="checkbox" checked={this.props.antiCheat} onChange={this.props.toggleAntiCheat}/>
           <div className="start-component__anticheat-message">
             ACTIVATE CYBORG ASLO?
           </div> 
           <input type="checkbox" checked={this.props.cyborg} onChange={this.props.toggleCyborg}/>
         </div>
      </div>
    );
	}
}