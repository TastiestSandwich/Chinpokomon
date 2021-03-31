import React from 'react';
import '../../root.scss';
import './game.scss';
import { CardInstance, shuffle, CardSource, getCardInstance, getNumberOfDiscardableCards, swapCardType, swapCardAction } from '../../components/card/card';
import { Hand, SelectedCard } from '../../components/hand/hand';
import { Chinpoko, ChinpokoData, getChinpokoSpe, getNumberOfAliveChinpokos } from '../../components/chinpoko/chinpoko';
import { getPhaseGroupAmount, PhaseCounter, PhaseGroup, PhaseData, CurrentPhase, initPhaseGroupData, setPhaseGroupData, shouldPhaseBeClicked, deleteFromPhaseGroupData, findHighestIndexOverLimit } from '../../components/phase/phase';
import { Engine, effectDamage, effectHeal, effectAbsorb, effectBoost, effectDrop, effectRegen, effectDegen, applyHpBoost, effectDot, effectStatAbsorb, effectStatClear } from '../../components/engine/engine';
import { CardAction, ActionEffect, ActionParameters } from '../../components/action/action';
import Power from '../../components/power/power';
import { Constants } from '../../data/const';
import { Modal, ModalData, ModalType, renderModalContent } from '../../components/modal/modal';
import { Cyborg, getCyborgPhases } from '../../components/cyborg/cyborg';
import { Info } from '../../components/info/info';
import { Type } from '../../components/type/type';

export const enum GameStage {
  PLAY,
  RESOLUTION,
  GAMEOVER,
  MODAL
}

export interface GameProps {
  allyTeam: {[id: number] : ChinpokoData}
  enemyTeam: {[id: number] : ChinpokoData}
  allyDeckList: {[id: number] : CardInstance}
  enemyDeckList: {[id: number] : CardInstance}
  allyDeck: Array<number>
  enemyDeck: Array<number>
  allyPowerList: {[id: number] : CardInstance}
  enemyPowerList: {[id: number] : CardInstance}
  setTeam: (team: {[id: number] : ChinpokoData}, ally: boolean) => void
  setDeckList: (deckList: {[id: number] : CardInstance}, ally: boolean) => void
  setPowerList: (powerList: {[id: number] : CardInstance}, ally: boolean) => void
  swapPlayers: () => void
  antiCheat: boolean
  cyborg: boolean
}

export interface GameState {
  allyDeck: Array<number>
  enemyDeck: Array<number>
  allyHand: Array<number>
  enemyHand: Array<number>
  allyDiscard: Array<number>
  enemyDiscard: Array<number>
  allyChinpoko: number
  enemyChinpoko: number
  selectedCard: CardInstance | null
  enemySelectedCard: CardInstance | null
  allyPhases: Array<PhaseData>
  enemyPhases: Array<PhaseData>
  allyStoredPhases: number
  enemyStoredPhases: number
  stage: GameStage
  previousStage: GameStage
  phaseCounters: Array<PhaseCounter>
  phaseLimit: number
  currentPhase: CurrentPhase | null
  modalData: ModalData | null
  cyborgClicked: boolean
  turn: number
}

export class Game extends React.Component<GameProps, GameState> {
  constructor(props) {
    super(props);
    this.state = {
      allyHand: [],
      enemyHand: [],
      allyDeck: shuffle([...this.props.allyDeck]),
      enemyDeck: shuffle([...this.props.enemyDeck]),
      allyDiscard: [],
      enemyDiscard: [],
      allyChinpoko: 1,
      enemyChinpoko: 1,
      selectedCard: null,
      enemySelectedCard: null,
      allyPhases: initPhaseGroupData(Constants.startingPhases),
      enemyPhases: initPhaseGroupData(Constants.startingPhases),
      allyStoredPhases: 0,
      enemyStoredPhases: 0,
      stage: GameStage.PLAY,
      previousStage: GameStage.PLAY,
      phaseCounters: [],
      phaseLimit: 0,
      currentPhase: null,
      modalData: null,
      cyborgClicked: false,
      turn: 1
    };
  }

  componentDidMount() {
    this.drawCards(true, Constants.startingHandSize);
    this.drawCards(false, Constants.startingHandSize);
  }

  drawCards = (ally: boolean, times: number) => {
    let deck = ally ? this.state.allyDeck : this.state.enemyDeck;
    let hand = ally ? this.state.allyHand : this.state.enemyHand;
    let discard = ally ? this.state.allyDiscard : this.state.enemyDiscard;
    for(let i = 0; i < times; i++) {
      let id = deck.shift();
      // if no more cards in deck, shuffle discard
      if(id == undefined) {
        deck = shuffle([...discard]);
        discard = []
        id = deck.shift();
      }
      if(id != undefined) {
        hand.push(id);
      }
    }
    if(ally) {
      this.setState({
        allyDeck: deck,
        allyHand: hand,
        allyDiscard: discard
      })
    } else {
      this.setState({
        enemyDeck: deck,
        enemyHand: hand,
        enemyDiscard: discard
      })
    }
  }

  handleCardClick = (instance: CardInstance) => {
    const deckList = {...this.props.allyDeckList};
    const powerList = {...this.props.allyPowerList};
    const id = instance.id;

    const clickedCard: CardInstance = instance.source == CardSource.DECK ? deckList[id] : powerList[id];
    if (clickedCard.isClicked || this.state.stage != GameStage.PLAY) {
      return;
    }
    this.setState({
      selectedCard: {...clickedCard}
    })
    clickedCard.isClicked = true;
    if (this.state.selectedCard != null) {
      const selectedCard = this.state.selectedCard.source == CardSource.DECK ? deckList[this.state.selectedCard.id] : powerList[this.state.selectedCard.id];
      selectedCard.isClicked = false;
    }
    this.props.setDeckList(deckList, true);
    this.props.setPowerList(powerList, true);
  }

  deleteCardClick = () => {
    if (this.state.stage != GameStage.PLAY) {
      return;
    }
    const deckList = {...this.props.allyDeckList};
    const powerList = {...this.props.allyPowerList};
    if(this.state.selectedCard != null) {
      const selectedCard = this.state.selectedCard.source == CardSource.DECK ? deckList[this.state.selectedCard.id] : powerList[this.state.selectedCard.id];
      selectedCard.isClicked = false;
    }
    this.setState({
      selectedCard: null,
    })
    this.props.setDeckList(deckList, true);
    this.props.setPowerList(powerList, true);
  }

  handlePhaseClick = (phaseNumber: number) => {
    if (this.state.stage != GameStage.PLAY) {
      return;
    }
    const instance = this.state.selectedCard;
    if ( shouldPhaseBeClicked(phaseNumber, instance, this.state.allyPhases) ) {
      this.setState((state) => ({
        allyPhases: setPhaseGroupData(phaseNumber, instance, state.allyPhases),
        selectedCard: null
      }))
    }
  }

  deletePhaseClick = (phaseNumber: number, instance: CardInstance | null) => {
    if (instance === null || this.state.stage != GameStage.PLAY) {
      return;
    }
    const deckList = {...this.props.allyDeckList};
    const powerList = {...this.props.allyPowerList};
    const card = instance.source == CardSource.DECK ? deckList[instance.id] : powerList[instance.id];
    card.isClicked = false;
    this.setState((state) => ({
      allyPhases: deleteFromPhaseGroupData(instance, state.allyPhases),
    }))
    this.props.setDeckList(deckList, true);
    this.props.setPowerList(powerList, true);
  }

  handleChangeTeamClick = () => {
    if (this.state.stage != GameStage.PLAY) {
      return;
    }
    this.props.swapPlayers();
    this.setState((state) => ({
      allyHand: state.enemyHand,
      enemyHand: state.allyHand,
      allyDeck: state.enemyDeck,
      enemyDeck: state.allyDeck,
      allyDiscard: state.enemyDiscard,
      enemyDiscard: state.allyDiscard,
      allyChinpoko: state.enemyChinpoko,
      enemyChinpoko: state.allyChinpoko,
      selectedCard: state.enemySelectedCard,
      enemySelectedCard: state.selectedCard,
      allyPhases: state.enemyPhases,
      enemyPhases: state.allyPhases,
      allyStoredPhases: state.enemyStoredPhases,
      enemyStoredPhases: state.allyStoredPhases
    }))
  }

  discardCardIfAble(instance: CardInstance, ally: boolean) {
    const myHand: Array<number> = ally? [...this.state.allyHand] : [...this.state.enemyHand];
    const myDiscard: Array<number> = ally? [...this.state.allyDiscard] : [...this.state.enemyDiscard];
    const myDeck = ally ? {...this.props.allyDeckList} : {...this.props.enemyDeckList};
    const myPowerList = ally ? {...this.props.allyPowerList} : {...this.props.enemyPowerList};

    const card = instance.source == CardSource.DECK ? myDeck[instance.id] : myPowerList[instance.id];
    card.isClicked = false;
    if(instance.isRemovable) {
      myHand.splice( myHand.indexOf(card.id), 1 );
      myDiscard.push(card.id);
    }
    if(ally) {
      this.setState({
        allyHand: myHand,
        allyDiscard: myDiscard,
      })
    } else {
      this.setState({
        enemyHand: myHand,
        enemyDiscard: myDiscard,
      })
    }
    this.props.setDeckList(myDeck, ally);
    this.props.setPowerList(myPowerList, ally);
   }

  handleCardAction(instance: CardInstance, action: CardAction, isAlly: boolean, ally: ChinpokoData, enemy: ChinpokoData) {
    if(action.effect.name === "DAMAGE") { effectDamage(instance.card, action, ally, enemy); }
    else if(action.effect.name === "ABSORB") { effectAbsorb(instance.card, action, ally, enemy); }
    else if(action.effect.name === "HEAL") { effectHeal(instance.card, action, ally); }
    else if(action.effect.name === "CHANGE") { this.effectChange(action, isAlly); }
    else if(action.effect.name === "BOOST") { effectBoost(instance.card, action, ally, enemy) }
    else if(action.effect.name === "DROP") { effectDrop(instance.card, action, ally, enemy) }
    else if(action.effect.name === "REGEN") { effectRegen(instance.card, action, ally) }
    else if(action.effect.name === "DEGEN") { effectDegen(instance.card, action, ally, enemy) }
    else if(action.effect.name === "DOT") { effectDot(instance.card, action, ally, enemy) }
    else if(action.effect.name === "DISCARD") { this.effectDiscard(action, isAlly) }
    else if(action.effect.name === "COPYCARD") { this.effectCopyCard(action, isAlly) }
    else if(action.effect.name === "DRAW") { this.effectDraw(action, isAlly) }
    else if(action.effect.name === "LOOK") { this.effectLookCard(action, isAlly) }
    else if(action.effect.name === "STATSORB") { effectStatAbsorb(instance.card, action, ally, enemy)}
    else if(action.effect.name === "CLEAR") { effectStatClear(instance.card, action, ally, enemy)}
    else if(action.effect.name === "TYPESWAP") { this.effectTypeSwap(action, isAlly)}
    else if(action.effect.name === "ACTIONSWAP") { this.effectActionSwap(action, isAlly)}
    else if(action.effect.name === "WAIT") { }
  }

  handleNextTurnClick = () => {
    if (this.state.stage === GameStage.PLAY) {
      const allyChinpoko: ChinpokoData = {...this.props.allyTeam[this.state.allyChinpoko]};
      const enemyChinpoko: ChinpokoData = {...this.props.enemyTeam[this.state.enemyChinpoko]};
      const allyPhases: Array<PhaseData> = [...this.state.allyPhases];
      const enemyPhases: Array<PhaseData> = [...this.state.enemyPhases];

      const phaseCounters: Array<PhaseCounter> = [
      {value: getChinpokoSpe(allyChinpoko), isAlly: true, remainingPhases: allyPhases},
      {value: getChinpokoSpe(enemyChinpoko), isAlly: false, remainingPhases: enemyPhases}];
      const phaseLimit: number = Math.max(...phaseCounters.map( pc => pc.value ));

      this.setState({
        stage: GameStage.RESOLUTION,
        phaseLimit: phaseLimit
      })
      this.solveNextPhase(phaseCounters, phaseLimit, allyChinpoko, enemyChinpoko);
      this.updateTeams(allyChinpoko, enemyChinpoko);
      this.stateBasedActions(phaseCounters, allyChinpoko, enemyChinpoko);
      this.setState({
        phaseCounters: phaseCounters
      });

    } else if (this.state.stage === GameStage.RESOLUTION) {
      const phaseCounters: Array<PhaseCounter> = [...this.state.phaseCounters];
      const allyChinpoko: ChinpokoData = {...this.props.allyTeam[this.state.allyChinpoko]};
      const enemyChinpoko: ChinpokoData = {...this.props.enemyTeam[this.state.enemyChinpoko]};
      if(phaseCounters.length > 0) {
        this.solveNextPhase(phaseCounters, this.state.phaseLimit, allyChinpoko, enemyChinpoko);
        this.updateTeams(allyChinpoko, enemyChinpoko);
        this.stateBasedActions(phaseCounters, allyChinpoko, enemyChinpoko);
        this.setState({
          phaseCounters: phaseCounters,
        });
      } else {
        this.doEndOfTurnEffects(allyChinpoko, enemyChinpoko);
        this.updateTeams(allyChinpoko, enemyChinpoko);
        this.drawCards(true, 1);
        this.drawCards(false, 1);
        this.setState((state) => ({
          stage: GameStage.PLAY,
          allyPhases: initPhaseGroupData(getPhaseGroupAmount(state.turn + 1, state.allyStoredPhases)),
          enemyPhases: initPhaseGroupData(getPhaseGroupAmount(state.turn + 1, state.enemyStoredPhases)),
          allyStoredPhases: 0,
          enemyStoredPhases: 0,
          currentPhase: null,
          cyborgClicked: false,
          turn: state.turn + 1
        }))
        this.stateBasedActions(phaseCounters, allyChinpoko, enemyChinpoko);
      }
    }
  }

  doEndOfTurnEffects(allyChinpoko: ChinpokoData, enemyChinpoko: ChinpokoData) {
    applyHpBoost(allyChinpoko)
    applyHpBoost(enemyChinpoko)
  }

  updateTeams(allyChinpoko: ChinpokoData, enemyChinpoko: ChinpokoData) {
    let allyTeam = this.props.allyTeam;
    let enemyTeam = this.props.enemyTeam;
    allyTeam[this.state.allyChinpoko] = allyChinpoko;
    enemyTeam[this.state.enemyChinpoko] = enemyChinpoko;
    this.props.setTeam(allyTeam, true);
    this.props.setTeam(enemyTeam, false);
  }

  stateBasedActions(phaseCounters: Array<PhaseCounter>, allyChinpoko: ChinpokoData, enemyChinpoko: ChinpokoData) {
    if(allyChinpoko.hp <= 0) {
      this.handleChinpokoDeath(phaseCounters, allyChinpoko, true)
    }
    if(enemyChinpoko.hp <= 0) {
      this.handleChinpokoDeath(phaseCounters, enemyChinpoko, false)
    }
    if(getNumberOfAliveChinpokos(this.props.allyTeam) <= 0) {
      console.log("GAME OVER, ENEMY WINS");
      this.setState({
        stage: GameStage.GAMEOVER
      })
    }
    if(getNumberOfAliveChinpokos(this.props.enemyTeam) <= 0) {
      console.log("GAME OVER, ALLY WINS");
      this.setState({
        stage: GameStage.GAMEOVER
      })
    }
  }

  handleChinpokoDeath(phaseCounters: Array<PhaseCounter>, chinpoko: ChinpokoData, ally: boolean) {
    console.log("RIP " + chinpoko.storedData.name);
    this.emptyRemainingPhases(phaseCounters)
    this.effectChangeModal(ally);
  }

  emptyRemainingPhases(phaseCounters: Array<PhaseCounter>) {
    for(let phaseCounter of phaseCounters) {
      while(phaseCounter.remainingPhases.length > 0) {
        let phase: PhaseData | undefined = phaseCounter.remainingPhases.shift()

        if (phase != undefined) {
          this.unfillPhase(phaseCounter.isAlly, phase)
          if(phase.instance && phase.isEnd) {
            this.discardCardIfAble(phase.instance, phaseCounter.isAlly)
          }
        }
      }
    }
    phaseCounters.splice(0, phaseCounters.length)
  }

  randomChange(ally: boolean): boolean {
    let team = ally ? this.props.allyTeam : this.props.enemyTeam;
    let chinpokoIndex = ally ? this.state.allyChinpoko : this.state.enemyChinpoko;
    let aliveChinpokos: Array<number> = [];
    // fill up array with alive chinpokos index
    for(let index of Object.keys(team)) {
      if (Number(index) != chinpokoIndex && team[Number(index)].hp > 0) {
        aliveChinpokos.push(Number(index));
      }
    }
    if(aliveChinpokos.length) {
      let random = Math.floor(Math.random() * aliveChinpokos.length);
      let newChinpoko: ChinpokoData = team[aliveChinpokos[random]];
      console.log("GO " + newChinpoko.storedData.name + "!");
      if (ally) {
        this.setState({
          allyChinpoko: aliveChinpokos[random]
        })
      } else {
        this.setState({
          enemyChinpoko: aliveChinpokos[random]
        })
      }
      return true;
    } else {
      console.log("There are no chinpokos left!")
      return false;
    }
  }

  effectChange(action: CardAction, isAlly: boolean) {
    const ally = action.parameters.ally == isAlly
    if (action.parameters.random) {
      this.randomChange(ally)
    } else {
      this.effectChangeModal(ally)
    }
  }

  effectChangeModal(ally: boolean) {
    if (this.props.cyborg && !ally) {
      this.randomChange(false)
    } else {
      // if current chinpoko is alive and only 1 chinpoko alive, cant change
      const team = ally ? this.props.allyTeam : this.props.enemyTeam
      const chinpoko = ally ? team[this.state.allyChinpoko] : team[this.state.enemyChinpoko]
      if (chinpoko.hp > 0 && getNumberOfAliveChinpokos(team) <= 1) {
        return
      }
      this.setState((state) => ({
        stage: GameStage.MODAL,
        previousStage: state.stage,
        modalData: {
          ally: ally,
          type: ModalType.CHINPOKO,
          title: "CHOOSE CHINPOKO TO CHANGE",
          onClick: this.handleChangeChinpokoClick
        }
      }))
    }
  }

  handleChangeChinpokoClick = (id: number, ally: boolean) => {
    if (ally) {
      this.setState((state) => ({
        stage: state.previousStage,
        allyChinpoko: id,
        modalData: null
      }))
    } else {
      this.setState((state) => ({
        stage: state.previousStage,
        enemyChinpoko: id,
        modalData: null
      }))
    }
  }

  effectDraw(action: CardAction, isAlly: boolean){
    const ally : boolean = action.parameters.ally === isAlly
    let number = action.parameters.number
    if (number == undefined) { number = 0 }
    this.drawCards(ally, number)
  }

  effectDiscard(action: CardAction, isAlly: boolean) {
    const ally : boolean = action.parameters.ally === isAlly
    if (this.props.cyborg && !ally) {
      // TODO: MAKE CYBORG DISCARD
    } else {
      // cant discard card when no discardable cards in hand
      const cardAmount = ally ? getNumberOfDiscardableCards(this.state.allyHand, this.props.allyDeckList)
                              : getNumberOfDiscardableCards(this.state.enemyHand, this.props.enemyDeckList)
      if (cardAmount <= 0) {
        return
      }
      this.setState((state) => ({
        stage: GameStage.MODAL,
        previousStage: state.stage,
        modalData: {
          ally: ally,
          type: ModalType.HAND,
          title: "CHOOSE CARD TO DISCARD",
          onClick: this.handleDiscardClick
        }
      }))
    }
  }

  handleDiscardClick = (id: number, ally: boolean) => {
    const deck = ally ? this.props.allyDeckList : this.props.enemyDeckList
    this.discardCardIfAble(deck[id], ally)
    this.setState((state) => ({
      stage: state.previousStage,
      modalData: null
    }))
  }

  effectCopyCard(action: CardAction, isAlly: boolean) {
    const ally : boolean = action.parameters.ally === isAlly
    if (this.props.cyborg && ally) {
      // TODO: MAKE CYBORG CHOOSE COPY
    } else {
      // cant copy card when no copiable (discardable) cards in hand
      const cardAmount = ally ? getNumberOfDiscardableCards(this.state.allyHand, this.props.allyDeckList)
                              : getNumberOfDiscardableCards(this.state.enemyHand, this.props.enemyDeckList)
      if (cardAmount <= 0) {
        return
      }
      this.setState((state) => ({
        stage: GameStage.MODAL,
        previousStage: state.stage,
        modalData: {
          ally: ally,
          type: ModalType.HAND,
          title: "CHOOSE CARD TO COPY",
          onClick: this.handleCopyCardClick,
          onClose: this.handleModalClose
        }
      }))
    }
  }

  handleCopyCardClick = (id: number, fromAlly: boolean) => {
    // fromAlly references the hand being copied
    const ally = !fromAlly
    const allyDeck = ally ? {...this.props.allyDeckList} : {...this.props.enemyDeckList}
    const enemyDeck = ally ? this.props.enemyDeckList : this.props.allyDeckList
    const newId: number = Object.keys(allyDeck).length
    const card : CardInstance = getCardInstance(newId, enemyDeck[id].card, enemyDeck[id].isRemovable, true, CardSource.DECK, null)
    allyDeck[newId] = card
    this.props.setDeckList(allyDeck, ally)

    const hand: Array<number> = ally ? [...this.state.allyHand] : [...this.state.enemyHand]
    hand.push(newId)
    if (ally) {
      this.setState((state) => ({
        stage: state.previousStage,
        allyHand: hand,
        modalData: null
      }))
    } else {
      this.setState((state) => ({
        stage: state.previousStage,
        enemyHand: hand,
        modalData: null
      }))
    }
  }

  effectLookCard(action: CardAction, isAlly: boolean) {
    const ally : boolean = action.parameters.ally === isAlly
    if (this.props.cyborg && ally) {
      // Cyborg does nothing
    } else {
      this.setState((state) => ({
        stage: GameStage.MODAL,
        previousStage: state.stage,
        modalData: {
          ally: ally,
          type: ModalType.HAND,
          title: "LOOK AT THE CARDS THEN CLOSE THE MODAL",
          onClose: this.handleModalClose
        }
      }))
    }
  }

  effectTypeSwap(action: CardAction, isAlly: boolean) {
    const ally : boolean = action.parameters.ally === isAlly
    if (this.props.cyborg && ally) {
      // TODO make cyborg typeswap card
    } else {
      // cant copy card when no copiable (discardable) cards in hand
      const cardAmount = ally ? getNumberOfDiscardableCards(this.state.allyHand, this.props.allyDeckList)
                              : getNumberOfDiscardableCards(this.state.enemyHand, this.props.enemyDeckList)
      if (cardAmount <= 0) {
        return
      }
      const type = action.parameters.type
      if (type === undefined) {
        return
      }
      this.setState((state) => ({
        stage: GameStage.MODAL,
        previousStage: state.stage,
        modalData: {
          ally: ally,
          type: ModalType.HAND,
          title: "CHOOSE A CARD TO CHANGE ITS TYPE TO " + type.name,
          onClick: this.handleTypeSwapClick(type),
          onClose: this.handleModalClose
        }
      }))
    }
  }

  handleTypeSwapClick = (type: Type) => (id: number, fromAlly: boolean) => {
    // fromAlly references the hand being typeswapped
    const allyDeck = fromAlly ? {...this.props.allyDeckList} : {...this.props.enemyDeckList}
    const card = allyDeck[id]
    const newCard = swapCardType(card, type)
    allyDeck[id] = newCard
    this.props.setDeckList(allyDeck, fromAlly)

    this.setState((state) => ({
      stage: state.previousStage,
      modalData: null
    }))
  }

  effectActionSwap(action: CardAction, isAlly: boolean) {
    const ally: boolean = action.parameters.ally === isAlly
    if (this.props.cyborg && ally) {
      //TODO make cyborg actionswap card
    } else {
      // cant typeswap card when no cards in hand
      const cardAmount = ally ? getNumberOfDiscardableCards(this.state.allyHand, this.props.allyDeckList)
                              : getNumberOfDiscardableCards(this.state.enemyHand, this.props.enemyDeckList)
      if (cardAmount <= 0) {
        return
      }
      const oldEffect = action.parameters.oldEffect
      const newEffect = action.parameters.newEffect
      const newParameters = action.parameters.newParameters
      if(oldEffect === undefined || newEffect === undefined || newParameters === undefined) {
        return
      }
      this.setState((state) => ({
        stage: GameStage.MODAL,
        previousStage: state.stage,
        modalData: {
          ally: ally,
          type: ModalType.HAND,
          title: "CHOOSE A CARD TO CHANGE " + oldEffect.name + " TO " + newEffect.name,
          onClick: this.handleActionSwapClick(oldEffect, newEffect, newParameters),
          onClose: this.handleModalClose
        }
      }))
    }
  }

  handleActionSwapClick = (oldEffect: ActionEffect, newEffect: ActionEffect, newParameters: ActionParameters) => (id: number, fromAlly: boolean) => {
    // fromAlly references the hand being actionswapped
    const allyDeck = fromAlly ? {...this.props.allyDeckList} : {...this.props.enemyDeckList}
    const card = {...allyDeck[id]}
    const newCard = swapCardAction(card, oldEffect, newEffect, newParameters)
    allyDeck[id] = newCard
    this.props.setDeckList({...allyDeck}, fromAlly)

    this.setState((state) => ({
      stage: state.previousStage,
      modalData: null
    }))
  }

  handleModalClose = () => {
    this.setState((state) => ({
      stage: state.previousStage,
      modalData: null
    }))
  }

  handleCyborgClick = () => {
    if (this.props.cyborg && !this.state.cyborgClicked) { 
      const allyChinpoko: ChinpokoData = {...this.props.allyTeam[this.state.allyChinpoko]};
      const enemyChinpoko: ChinpokoData = {...this.props.enemyTeam[this.state.enemyChinpoko]};
      const cyborgHand : Array<CardInstance> = this.state.enemyHand.map(a => this.props.enemyDeckList[a]);
      const chinpokoPower: CardInstance = enemyChinpoko.powerId ? this.props.enemyPowerList[enemyChinpoko.powerId] : this.props.enemyPowerList[0];
      const cyborgPower: CardInstance = this.props.enemyPowerList[0];

      this.setState((state) => ({
        enemyPhases: getCyborgPhases(state.enemyPhases, enemyChinpoko, allyChinpoko, cyborgHand, chinpokoPower, cyborgPower),
        cyborgClicked: true
      }))
    }
  }

  unfillPhase(isAlly: boolean, phase: PhaseData) {
    if (isAlly) {
      const myPhases: Array<PhaseData> = [...this.state.allyPhases];
      myPhases[phase.index - 1].show = true;
      this.setState({
        allyPhases: myPhases,
        currentPhase: {isAlly: true, index: phase.index}
      })
    } else {
      const myPhases: Array<PhaseData> = [...this.state.enemyPhases];
      myPhases[phase.index - 1].show = true;
      this.setState({
        enemyPhases: myPhases,
        currentPhase: {isAlly: false, index: phase.index}
      })
    }
  }

  increaseStoredPhases(isAlly: boolean) {
    const storedPhases = isAlly ? this.state.allyStoredPhases : this.state.enemyStoredPhases
    const newStoredPhases = storedPhases + 1
    if (newStoredPhases > Constants.maxStoredPhases) {
      return
    }
    if(isAlly) {
      this.setState({
        allyStoredPhases: newStoredPhases
      })
    } else {
      this.setState({
        enemyStoredPhases: newStoredPhases
      })
    }
  }

  solveNextPhase(phaseCounters: Array<PhaseCounter>, phaseLimit: number, allyChinpoko: ChinpokoData, enemyChinpoko: ChinpokoData) {
    const index: number = findHighestIndexOverLimit(phaseCounters, phaseLimit);
    if (index >= 0) {

      const phaseCounter: PhaseCounter = phaseCounters[index];
      // remove phase from counter and do its action if it exists
      let phase: PhaseData | undefined = phaseCounter.remainingPhases.shift();

      if (phase != undefined) {
        const myChinpoko: ChinpokoData = phaseCounter.isAlly ? allyChinpoko : enemyChinpoko;
        const otherChinpoko: ChinpokoData = phaseCounter.isAlly ? enemyChinpoko : allyChinpoko;
        console.log( "doing phase " + phase.index + " of chinpoko " + myChinpoko.storedData.name);

        this.unfillPhase(phaseCounter.isAlly, phase);
        if (phase.action != null && phase.instance != null) {
          let instance = phase.instance;
          let action = phase.action;
          console.log(action.effect);
          this.handleCardAction(instance, action, phaseCounter.isAlly, myChinpoko, otherChinpoko);

          if(phase.isEnd) {
            this.discardCardIfAble(instance, phaseCounter.isAlly);
          }
        } else {
          this.increaseStoredPhases(phaseCounter.isAlly)
        }
      }
      // delete phaseCounter if no more phases, else antisum limit
      if (phaseCounter.remainingPhases.length <= 0) {
        phaseCounters.splice(index,1);
      } else {
        phaseCounter.value = phaseCounter.value - phaseLimit;
      }

    } else {
      // sum speed to each phaseCounter and try again
      for (const pc of phaseCounters) {
        const myChinpoko: ChinpokoData = pc.isAlly ? allyChinpoko : enemyChinpoko;
        pc.value = pc.value + getChinpokoSpe(myChinpoko)
      }
      this.solveNextPhase(phaseCounters, phaseLimit, allyChinpoko, enemyChinpoko);
    }
  }

  renderField() {
    const enemyChinpoko: ChinpokoData = this.props.enemyTeam[this.state.enemyChinpoko];
    const allyChinpoko: ChinpokoData = this.props.allyTeam[this.state.allyChinpoko];
    const allyPower: CardInstance = allyChinpoko.powerId ? this.props.allyPowerList[allyChinpoko.powerId] : this.props.allyPowerList[0];
    const stage: GameStage = this.state.stage;

    return (
      <div className = "game-component__field">
        <Chinpoko chinpoko = {enemyChinpoko} ally={false} />
        <Engine />
        <Chinpoko chinpoko = {allyChinpoko} ally={true} />
        <Power instance={allyPower} stage={stage} onClick={() => this.handleCardClick(allyPower)}
        antiCheat={this.props.antiCheat} />
      </div>
    );
  }

  renderModal() {
    const open = this.state.stage === GameStage.MODAL
    const modalData = this.state.modalData
    if(!open || modalData == null) {
      return
    }

    return (
      <Modal title={modalData.title} onClose={modalData.onClose}>
        { renderModalContent(this.state, this.props) }
      </Modal>
    )
  }

  renderCyborg() {
    const show = this.props.cyborg
    if (show) {
      return ( 
        <Cyborg onClick={this.handleCyborgClick} clicked={this.state.cyborgClicked}/>
      )
    }
    return
  }

  renderInfo(ally: boolean) {
    const totalChinpokos = ally ? Object.keys(this.props.allyTeam).length :  Object.keys(this.props.enemyTeam).length
    const aliveChinpokos = ally ? getNumberOfAliveChinpokos(this.props.allyTeam) : getNumberOfAliveChinpokos(this.props.enemyTeam)
    const totalDeck = ally ? this.state.allyDeck.length : this.state.enemyDeck.length
    const totalDiscard = ally ? this.state.allyDiscard.length : this.state.enemyDiscard.length
    return (
      <Info totalChinpokos={totalChinpokos} aliveChinpokos={aliveChinpokos} totalDeck={totalDeck} totalDiscard={totalDiscard} />
    )
  }

  render() {
    const allyInstances: Array<CardInstance> = this.state.allyHand.map(a => this.props.allyDeckList[a]);
    const enemyInstances: Array<CardInstance> = this.state.enemyHand.map(a => this.props.enemyDeckList[a]);
    const trainerPower: CardInstance = this.props.allyPowerList[0];

    const stage: GameStage = this.state.stage;
    const cyborgClick: (() => void) | null = this.props.cyborg && !this.state.cyborgClicked ? this.handleCyborgClick : null

    return (
      <div className="game-component">
        { this.renderModal() }
        <div className="game-component__phases">
          { <ChangeTeam stage={this.state.stage} changeTeamClick={this.handleChangeTeamClick} cyborg={this.props.cyborg}/> }
          { <NextTurn stage={this.state.stage} nextTurnClick={this.handleNextTurnClick} cyborgClick={cyborgClick}/> }
          { <PhaseGroup phases={this.state.enemyPhases} ally={false} stage={stage} currentPhase={this.state.currentPhase} 
            antiCheat={this.props.antiCheat} turn={this.state.turn}/> }
          { <PhaseGroup phases={this.state.allyPhases} ally={true} stage={stage} currentPhase={this.state.currentPhase}
            onPhaseClick={this.handlePhaseClick}
            onPhaseDelete={this.deletePhaseClick}
            antiCheat={this.props.antiCheat} turn={this.state.turn}/> }
          <div className="game-component__selected">
            { this.state.selectedCard &&
            <SelectedCard instance={this.state.selectedCard} deleteCardClick={this.deleteCardClick} stage={this.state.stage}/> 
            }
            <div className="game-component__ally-trainer">
              <Power instance={trainerPower} stage={stage} onClick={() => this.handleCardClick(trainerPower)} 
              antiCheat={this.props.antiCheat}/>
            </div>          
          </div>
        </div>
        <div className="game-component__board">
          <div className="game-component__enemy-zone">
            { this.renderCyborg() }
            <Hand instances={enemyInstances} ally={false} stage={stage} className="game-component__hand"
            antiCheat={this.props.antiCheat}/>
            { this.renderInfo(false) }
          </div>
          { this.renderField() }
          <div className="game-component__ally-zone">
            <Hand instances={allyInstances} ally={true} stage={stage} onCardClick={this.handleCardClick} className="game-component__hand"
            antiCheat={this.props.antiCheat}/>
            { this.renderInfo(true) }
          </div>
        </div>
      </div>
    );
  }
}

interface NextTurnProps {
  stage: GameStage
  nextTurnClick: () => void
  cyborgClick: (() => void) | null
}

class NextTurn extends React.Component<NextTurnProps> {
  render() {
    let text: string = this.props.stage === GameStage.RESOLUTION ? "NEXT PHASE" : "NEXT TURN"
    let onClick: () => void = this.props.nextTurnClick
    // activate cyborg aslo if needed
    if (this.props.cyborgClick != null) {
      text = "ACTIVATE CYBORG ASLO"
      onClick = this.props.cyborgClick
    }
    return (
      <div className="next-turn">
        <button className = "next-turn-button" onClick={onClick}>
          {text}
        </button>
      </div>
    )
  }
}

interface ChangeTeamProps {
  stage: GameStage
  changeTeamClick?: () => void
  cyborg: boolean
}

class ChangeTeam extends React.Component<ChangeTeamProps> {
  render() {
    const show = this.props.stage === GameStage.PLAY && !this.props.cyborg;
    return (
      <div>
      {
        show &&
        <>
        <div className="change-team">
          <button className = "change-team-button" onClick={this.props.changeTeamClick}>
            CHANGE TEAM
          </button>
        </div>
        </>
      }
      </div>
    )
  }
}