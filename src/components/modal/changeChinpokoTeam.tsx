import React from 'react';
import './modal.scss';
import { ChinpokoData } from '../../components/chinpoko/chinpoko';
import TeamChinpoko from '../../views/teamBuilder/teamChinpoko';

interface ChangeChinpokoTeamProps {
  ally: boolean
  onChinpokoClick: (id: number, ally: boolean) => void
  team: {[id: number] : ChinpokoData}
  currentChinpokoId: number
}

export default class ChangeChinpokoTeam extends React.Component<ChangeChinpokoTeamProps> {

  handleClick = (id:number) => () => {
    this.props.onChinpokoClick(id, this.props.ally)
  }

  render() {
    const team = this.props.team
    const chinpokoKeys = Object.keys(team);

    return(
      <div className="change-chinpoko-team-component">
        { chinpokoKeys.map((key) => (
          <TeamChinpoko
            key={key}
            chinpoko={team[key]}
            id={parseInt(key)}
            onClick={this.handleClick(parseInt(key))}
           />
          ))}
      </div>
    );
  }
}