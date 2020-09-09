import React from 'react';
import './modal.scss';
import { ChinpokoData } from '../../components/chinpoko/chinpoko';
import TeamChinpoko from '../../views/teamBuilder/teamChinpoko';

interface ChangeChinpokoTeamProps {
  ally: boolean
  onChinpokoClick: (id: number, ally: boolean) => void
  team: {[id: number] : ChinpokoData}
  currentChinpokoId: number
  antiCheat: boolean
}

interface ChangeChinpokoTeamState {
  hover: boolean
}

export default class ChangeChinpokoTeam extends React.Component<ChangeChinpokoTeamProps, ChangeChinpokoTeamState> {
  constructor(props) {
    super(props);
    this.state = {
      hover: false
    };
  }

  handleMouseOver = () => {
    this.setState({
      hover: true
    })
  }
  handleMouseOut = () => {
    this.setState({
      hover: false
    })
  }

  handleClick = (id:number) => () => {
    this.props.onChinpokoClick(id, this.props.ally)
  }

  renderTeamChinpokos() {
    const team = this.props.team
    const chinpokoKeys = Object.keys(team);

    return (
      <>
      { chinpokoKeys.map((key) => (
          <TeamChinpoko
            key={key}
            chinpoko={team[key]}
            id={parseInt(key)}
            currentId={this.props.currentChinpokoId}
            onClick={this.handleClick(parseInt(key))}
           />
      ))}
      </>
    )
  }

  renderEmptyBoxes() {
    const team = this.props.team
    const chinpokoKeys = Object.keys(team);

    return (
      <>
      { chinpokoKeys.map((key) => (
        <div className="change-chinpoko-team-component__empty-box" key={key}>
        </div>
      ))}
      </>
    )
  }

  render() {
    const show = !this.props.antiCheat || this.state.hover

    return(
      <div className="change-chinpoko-team-component" onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut}>
        { show ? this.renderTeamChinpokos() : this.renderEmptyBoxes() }
      </div>
    );
  }
}