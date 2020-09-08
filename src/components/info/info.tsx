import React from 'react';
import './info.scss';

interface InfoProps {
  totalChinpokos: number
  aliveChinpokos: number
  totalDeck: number
  totalDiscard: number
}

export class Info extends React.Component<InfoProps, {} > {
  render() {
    const {totalChinpokos, aliveChinpokos, totalDeck, totalDiscard} = this.props
    return (
      <div className={`info-component`}>
        <table>
          <tbody>
            <tr>
              <td>
                <i className="fas fa-paw"/>
              </td>
              <td>{aliveChinpokos + "/" + totalChinpokos}</td>
            </tr>
            <tr>
              <td>
                <i className="fas fa-folder-open"/>
              </td>
              <td>{totalDeck}</td>
            </tr>
            <tr>
              <td>
                <i className="fas fa-trash"/>
              </td>
              <td>{totalDiscard}</td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
}