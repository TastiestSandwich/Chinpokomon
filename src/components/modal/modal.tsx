import React from 'react';
import './modal.scss';
import { GameState, GameProps } from '../../views/game/game'
import ChangeChinpokoTeam from './changeChinpokoTeam'
import ChooseCard from './chooseCard'
import { CardInstance } from '../../components/card/card'

export interface ModalData {
  ally: boolean
  type: ModalType
  title: string
  onClick?: (id: number, ally: boolean) => void
  onClose?: () => void
}

export const enum ModalType {
  CHINPOKO,
  HAND
}

export function renderModalContent(state: GameState, props: GameProps) {
  if (!state.modalData) {
    return
  }

  const onClick = state.modalData.onClick ? state.modalData.onClick : () => {return}

  switch (state.modalData.type) {
    case ModalType.CHINPOKO:
      const team = state.modalData.ally ? props.allyTeam : props.enemyTeam
      const currentId = state.modalData.ally ? state.allyChinpoko : state.enemyChinpoko

      return (
        <ChangeChinpokoTeam 
        ally={state.modalData.ally} 
        team={team} currentChinpokoId={currentId}
        onChinpokoClick={onClick} 
        antiCheat={props.antiCheat}
        />
      )

    case ModalType.HAND:
      const hand = state.modalData.ally ? state.allyHand : state.enemyHand
      const deck = state.modalData.ally ? props.allyDeckList : props.enemyDeckList
      //JuEj
      let cards: {[id: number] : CardInstance} = {}
      hand.map(a => deck[a]).filter(card => !card.isClicked && card.isRemovable).forEach(card => cards[card.id] = card)

      return (
        <ChooseCard 
        ally={state.modalData.ally} 
        cards={cards} 
        anticheat={props.antiCheat} 
        onCardClick={onClick}/>
      )
    default:
      // should not be reached
      return
  }
}

interface ModalProps {
  title?: string
  onClose?: () => void
}

export class Modal extends React.Component<ModalProps> {
  render() {
    const title = this.props.title || ""
    return(
      <div className="modal-component">
        <div className="modal-component__modal-box">
          <div className="modal-component__modal-header">
            <div className="modal-component__modal-title">
              { title }
            </div>
            { this.props.onClose && 
              <div className="modal-component__modal-close" onClick={this.props.onClose}>
                <i className="fas fa-window-close"></i>
              </div>
            }
          </div>
          <div className="modal-component__modal-content">
            { this.props.children }
          </div>
        </div>
      </div>
    );
  }
}