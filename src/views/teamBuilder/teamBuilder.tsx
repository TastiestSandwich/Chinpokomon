import React from 'react';
import { AppView } from '../../app';
import { ChinpokoData, ChinpokoStoredData, getChinpokoData, BaseChinpokoList, getRandomChinpoko } from '../../components/chinpoko/chinpoko';
import { TeamChinpoko } from './teamChinpoko';
import './teamBuilder.scss';

export interface ChinpokoInputData {
  name: string
  species: string
  lvl: number
  evHP: number
  evATK: number
  evDEF: number
  evSPE: number
}

export function getRandomTeam(size: number) {
  let team: {[id: number] : ChinpokoData} = {};
  for(let i=0; i < size; i++) {
    team[i] = getRandomChinpoko();
  }
  return team;
}

function transformInputArrayToTeam(inputArray: Array<ChinpokoInputData>): {[id: number] : ChinpokoData} {
  const team: {[id: number] : ChinpokoData} = {};
  for(let i=0; i < inputArray.length; i++) {
    team[i] = getChinpokoData(transformInputToStored(inputArray[i]));
  }
  return team;
}

function transformInputToStored(input: ChinpokoInputData): ChinpokoStoredData {
  return ({
    name: input.name,
    species: BaseChinpokoList[input.species],
    lvl: input.lvl, evHP: input.evHP, evATK: input.evATK, evDEF: input.evDEF, evSPE: input.evSPE
  })
}

function transformTeamToInput(team: {[id: number] : ChinpokoData}) {
  const input: Array<ChinpokoInputData> = [];
  for(let chinpoko of Object.values(team)) {
    input.push( transformDataToInput(chinpoko) );
  }
  return input;
}

function transformDataToInput(data: ChinpokoData): ChinpokoInputData {
  return ({
    name: data.storedData.name,
    species: data.storedData.species.speciesName,
    lvl: data.storedData.lvl, evHP: data.storedData.evHP, evATK: data.storedData.evATK, evDEF: data.storedData.evDEF, evSPE: data.storedData.evSPE
  })
}

interface TeamBuilderProps {
  changeView: (view: AppView) => void
  setTeam: (team: {[id: number] : ChinpokoData}, ally: boolean) => void
  swapTeams: () => void
  allyTeam: {[id: number] : ChinpokoData}
  enemyTeam: {[id: number] : ChinpokoData}
}

interface TeamBuilderState {
  message: string
  input: string
  ally: boolean
}

export class TeamBuilder extends React.Component<TeamBuilderProps, TeamBuilderState> {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      input: JSON.stringify( transformTeamToInput(this.props.allyTeam) ),
      ally: true
    }
  }

  handleChangePlayer = () => {
    const team = this.props.enemyTeam;
    this.setState(prevState => ({
      ally: !prevState.ally,
      input: JSON.stringify( transformTeamToInput(team) )
    }));
    this.props.swapTeams();  
  }

  handleInput = (event) => {
    this.setState({
      input: event.target.value,
      message: ""
    })
  }

  handleSubmit = () => {
    const input = JSON.parse(this.state.input);
    this.props.setTeam( transformInputArrayToTeam(input), true );
    this.setState({
      message: "Team submitted successfully!"
    })
  }

  changeViewToStart = () => {
    this.props.changeView(AppView.START);
  }

  render(){
    const player = this.state.ally ? "PLAYER 1" : "PLAYER 2";
    const team = this.props.allyTeam;
    const chinpokoKeys = Object.keys(team);

  	return (
  		<div className="team-builder-component">
        <button className="team-builder-component__start-button" onClick={this.changeViewToStart}>
          BACK
        </button>
  			<div className="team-builder-component__title">
  				TEAM BUILDER
  			</div>
        <div className="team-builder-component__subtitle">
          <div className="team-builder-component__player">
            {player}
          </div>
          <button className="team-builder-component__player-button" onClick={this.handleChangePlayer}>
            CHANGE PLAYER
          </button>
        </div>
        <div className="team-builder-component__team">
          { chinpokoKeys.map((key) => (
          <TeamChinpoko
            key={key}
            chinpoko={team[key]}
           />
          ))}
        </div>
        <div className="team-builder-component__body">
          <button className="team-builder-component__submit-button" onClick={this.handleSubmit}>
            SUBMIT
          </button>
          <textarea className="team-builder-component__input" onChange={this.handleInput} value={this.state.input}>
          </textarea>
        </div>
        <div className="team-builder-component__message">
          {this.state.message}
        </div>
  		</div>
	  )
  }
}