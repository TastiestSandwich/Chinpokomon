import React from 'react';
import '../../root.scss';
import './game.scss';
import { CardInstance, shuffle, CardSource, getCardInstance } from '../../components/card/card';
import { Hand, SelectedCard } from '../../components/hand/hand';
import { Chinpoko, ChinpokoData, getChinpokoSpe } from '../../components/chinpoko/chinpoko';
import { PhaseCounter, PhaseGroup, PhaseData, CurrentPhase, initPhaseGroupData, setPhaseGroupData, shouldPhaseBeClicked, deleteFromPhaseGroupData, findHighestIndexOverLimit } from '../../components/phase/phase';
import { Engine, effectDamage, effectHeal, effectAbsorb, effectBoost, effectDrop, effectRegen, effectDegen, applyHpBoost, effectDot } from '../../components/engine/engine';
import { CardAction } from '../../components/action/action';
import Power from '../../components/power/power';
import { Constants } from '../../data/const';
import Modal from '../../components/modal/modal';
import ChangeChinpokoTeam from '../../components/modal/changeChinpokoTeam';
import ChooseCard from '../../components/modal/chooseCard';
import { Cyborg, getCyborgPhases } from '../../components/cyborg/cyborg';
import { Info } from '../../components/info/info';

export const enum GameStage {
  PLAY,
  RESOLUTION,
  GAMEOVER,
  MODAL
}

export const enum ModalType {
  CHANGE_CHINPOKO,
  CHOOSE_DISCARD,
  CHOOSE_COPY_CARD,
  LOOK_CARD
}

interface GameProps {
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
  modalAlly: boolean
  modalType: ModalType
  cyborgClicked: boolean
}

export class Game extends React.Component<GameProps, GameState> {
  constructor(props) {
    super(props);
    this.state = {
      allyHand: [],
      enemyHand: [],
      // allyDeck: shuffle(Object.keys(this.props.allyDeckList).map(i => Number(i))),
      // enemyDeck: shuffle(Object.keys(this.props.enemyDeckList).map(i => Number(i))),
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
      modalAlly: true,
      modalType: ModalType.CHANGE_CHINPOKO,
      cyborgClicked: false
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
    else if(action.effect.name === "CHANGE") { this.effectChangeModal(isAlly); }
    else if(action.effect.name === "BOOST") { effectBoost(instance.card, action, ally, enemy) }
    else if(action.effect.name === "DROP") { effectDrop(instance.card, action, ally, enemy) }
    else if(action.effect.name === "REGEN") { effectRegen(instance.card, action, ally) }
    else if(action.effect.name === "DEGEN") { effectDegen(instance.card, action, ally, enemy) }
    else if(action.effect.name === "DOT") { effectDot(instance.card, action, ally, enemy) }
    else if(action.effect.name === "DISCARD") { this.effectDiscard(action, isAlly) }
    else if(action.effect.name === "COPYCARD") { this.effectCopyCard(action, isAlly) }
    else if(action.effect.name === "DRAW") { this.effectDraw(action, isAlly) }
    else if(action.effect.name === "LOOK") { this.effectLookCard(action, isAlly) }
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
      this.stateBasedActions(allyChinpoko, enemyChinpoko);
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
        this.stateBasedActions(allyChinpoko, enemyChinpoko);
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
          allyPhases: initPhaseGroupData(Constants.startingPhases + state.allyStoredPhases),
          enemyPhases: initPhaseGroupData(Constants.startingPhases + state.enemyStoredPhases),
          allyStoredPhases: 0,
          enemyStoredPhases: 0,
          currentPhase: null,
          cyborgClicked: false
        }))
        this.stateBasedActions(allyChinpoko, enemyChinpoko);
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

  stateBasedActions(allyChinpoko: ChinpokoData, enemyChinpoko: ChinpokoData) {
    if(allyChinpoko.hp <= 0) {
      this.handleChinpokoDeath(allyChinpoko, true)
    }
    if(enemyChinpoko.hp <= 0) {
      this.handleChinpokoDeath(enemyChinpoko, false)
    }
    if(this.getNumberOfAliveChinpokos(this.props.allyTeam) <= 0) {
      console.log("GAME OVER, ENEMY WINS");
      this.setState({
        stage: GameStage.GAMEOVER
      })
    }
    if(this.getNumberOfAliveChinpokos(this.props.enemyTeam) <= 0) {
      console.log("GAME OVER, ALLY WINS");
      this.setState({
        stage: GameStage.GAMEOVER
      })
    }
  }

  handleChinpokoDeath(chinpoko: ChinpokoData, ally: boolean) {
    console.log("RIP " + chinpoko.storedData.name);
    this.effectChangeModal(ally);
  }

  getNumberOfAliveChinpokos(team: {[id: number] : ChinpokoData}) : number {
    let aliveChinpokos : number = 0
    for(let index of Object.keys(team)) {
      if (team[Number(index)].hp > 0) {
        aliveChinpokos = aliveChinpokos + 1
      }
    }
    return aliveChinpokos
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

  effectChangeModal(ally: boolean) {
    if (this.props.cyborg && !ally) {
      this.randomChange(false)
    } else {
      this.setState((state) => ({
        stage: GameStage.MODAL,
        previousStage: state.stage,
        modalAlly: ally,
        modalType: ModalType.CHANGE_CHINPOKO
      }))
    }
  }

  handleChangeChinpokoClick = (id: number, ally: boolean) => {
    if (ally) {
      this.setState((state) => ({
        stage: state.previousStage,
        allyChinpoko: id
      }))
    } else {
      this.setState((state) => ({
        stage: state.previousStage,
        enemyChinpoko: id
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
      this.setState((state) => ({
        stage: GameStage.MODAL,
        previousStage: state.stage,
        modalAlly: ally,
        modalType: ModalType.CHOOSE_DISCARD
      }))
    }
  }

  handleDiscardClick = (id: number, ally: boolean) => {
    const deck = ally ? this.props.allyDeckList : this.props.enemyDeckList
    this.discardCardIfAble(deck[id], ally)
    this.setState((state) => ({
      stage: state.previousStage
    }))
  }

  effectCopyCard(action: CardAction, isAlly: boolean) {
    const ally : boolean = action.parameters.ally === isAlly
    if (this.props.cyborg && ally) {
      // TODO: MAKE CYBORG CHOOSE COPY
    } else {
      this.setState((state) => ({
        stage: GameStage.MODAL,
        previousStage: state.stage,
        modalAlly: ally,
        modalType: ModalType.CHOOSE_COPY_CARD
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
        allyHand: hand
      }))
    } else {
      this.setState((state) => ({
        stage: state.previousStage,
        enemyHand: hand
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
        modalAlly: ally,
        modalType: ModalType.LOOK_CARD
      }))
    }
  }

  handleLookClick = (id: number, fromAlly: boolean) => {
    this.setState((state) => ({
      stage: state.previousStage
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

  renderChangeModal() {
    const open = this.state.stage === GameStage.MODAL && this.state.modalType === ModalType.CHANGE_CHINPOKO
    const team = this.state.modalAlly ? this.props.allyTeam : this.props.enemyTeam
    const currentId = this.state.modalAlly ? this.state.allyChinpoko : this.state.enemyChinpoko
    return (
      <Modal open={open} title="CHOOSE CHINPOKO TO CHANGE">
        <ChangeChinpokoTeam ally={this.state.modalAlly} team={team} currentChinpokoId={currentId}
        onChinpokoClick={this.handleChangeChinpokoClick} antiCheat={this.props.antiCheat}/>
      </Modal>
    )
  }

  renderChooseCardModal() {
    const open = this.state.stage === GameStage.MODAL && 
      (this.state.modalType === ModalType.CHOOSE_COPY_CARD || this.state.modalType === ModalType.CHOOSE_DISCARD || this.state.modalType === ModalType.LOOK_CARD)
    const hand  = this.state.modalAlly ? this.state.allyHand : this.state.enemyHand
    const deck = this.state.modalAlly ? this.props.allyDeckList : this.props.enemyDeckList
    //JuEj
    let cards: {[id: number] : CardInstance} = {}
    hand.map(a => deck[a]).filter(card => !card.isClicked && card.isRemovable).forEach(card => cards[card.id] = card)

    let title = "undefined"
    let cardClick = (id: number, ally: boolean) => {}
    if (this.state.modalType === ModalType.CHOOSE_COPY_CARD) { 
      title = "CHOOSE CARD TO COPY"
      cardClick = this.handleCopyCardClick
    } else if (this.state.modalType === ModalType.CHOOSE_DISCARD) { 
      title = "CHOOSE CARD TO DISCARD" 
      cardClick = this.handleDiscardClick
    } else if (this.state.modalType === ModalType.LOOK_CARD) {
      title = "LOOK AT THE CARDS AND CLICK ONE TO LEAVE"
      cardClick = this.handleLookClick
    }

    return(
      <Modal open={open} title={title}>
        <ChooseCard ally={this.state.modalAlly} cards={cards} anticheat={this.props.antiCheat} onCardClick={cardClick}/>
      </Modal>
    )
  }

  renderModals() {
    return(
      <>
      { this.renderChangeModal() }
      { this.renderChooseCardModal() }
      </>
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
    const aliveChinpokos = ally ? this.getNumberOfAliveChinpokos(this.props.allyTeam) : this.getNumberOfAliveChinpokos(this.props.enemyTeam)
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
        { this.renderModals() }
        <div className="game-component__phases">
          { <ChangeTeam stage={this.state.stage} changeTeamClick={this.handleChangeTeamClick} cyborg={this.props.cyborg}/> }
          { <NextTurn stage={this.state.stage} nextTurnClick={this.handleNextTurnClick} cyborgClick={cyborgClick}/> }
          { <PhaseGroup phases={this.state.enemyPhases} ally={false} stage={stage} currentPhase={this.state.currentPhase} 
            antiCheat={this.props.antiCheat} /> }
          { <PhaseGroup phases={this.state.allyPhases} ally={true} stage={stage} currentPhase={this.state.currentPhase}
            onPhaseClick={this.handlePhaseClick}
            onPhaseDelete={this.deletePhaseClick}
            antiCheat={this.props.antiCheat} /> }
          <div className="game-component__selected">
           { this.state.selectedCard &&
            <SelectedCard instance={this.state.selectedCard} deleteCardClick={this.deleteCardClick} stage={this.state.stage}/> }
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
            <div className="game-component__ally-trainer">
              <Power instance={trainerPower} stage={stage} onClick={() => this.handleCardClick(trainerPower)} 
              antiCheat={this.props.antiCheat}/>
            </div>
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