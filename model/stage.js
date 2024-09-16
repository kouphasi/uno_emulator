
import cardCreators from '../constants/card_creators.js';

class Stage {
  players = [];
  turn = 1;
  currentPlayerIndex = 0;
  fieldCards = [];
  isOpposite = false;
  finishedPlayers = [];
  num = 0;
  color = null;
  drawNum = 0;
  skipNum = 0;

  constructor(players) {
    this.players = players;
  }

  get playablePlayers() {
    return this.players.filter(player => !this.finishedPlayers.includes(player));
  }

  get currentPlayer() {
    return this.getPlayer(this.playerIndex(this.currentPlayerIndex));
  }

  get previousPlayer() {
    const previousIndex = this.currentPlayerIndex - (this.isOpposite ? -1 : 1);
    return this.getPlayer(this.playerIndex(this.currentPlayerIndex - 1));
  }

  getPlayer(index) {
    return this.playablePlayers[index];
  }

  playerIndex(index) {
    const playerCount = this.playablePlayers.length;
    return index % playerCount < 0
      ? index % playerCount + playerCount
      : index % playerCount;
  }

  get latestCard() {
    return this.fieldCards[this.fieldCards.length - 1];
  }

  finishPlayer(player) {
    this.finishedPlayers.push(player);
  }

  nextPlayerIndex(step=1) {
    this.currentPlayerIndex = this.currentPlayerIndex + (this.isOpposite ? -step : step);
  }

  draw() {
    console.log('draw');
    return cardCreators[Math.floor(Math.random() * cardCreators.length)]();
  }

  reverse() {
    this.isOpposite = !this.isOpposite;
  }

  setColor(color) {
    this.color = color;
  }

  setNum(num) {
    this.num = num;
  }

  addDrawNum(drawNum) {
    this.drawNum += drawNum;
  }

  resetDrawNum() {
    this.drawNum = 0;
  }

  addSkipNum(skipNum) {
    this.skipNum += skipNum;
  }

  resetSkipNum() {
    this.skipNum = 0;
  }

  putCards(cards) {
    if(cards == null) return;
    cards[cards.length - 1].handleCard(this);
    this.fieldCards = [...this.fieldCards, ...cards];
  }

  nextTurn() {
    this.turn++;
    if(this.currentPlayer.cardCount === 0) this.finishPlayer(this.currentPlayer);
    const step = 1 + this.skipNum;
    this.resetSkipNum();
    this.nextPlayerIndex(step);
  }

  commitWithSingleChance() {
    return this.currentPlayer.putCards(this);
  }

  commitWithDoubleChance() {
    const firstCard = this.currentPlayer.putCards(this);
    if(firstCard != null) return firstCard;
    this.currentPlayer.getCard(this.draw());
    return this.currentPlayer.putCards(this);
  }

  setUpField() {
    this.finishedPlayers = [];
    // shuffle Players
    this.players = this.players.sort(() => Math.random() - 0.5);

    // distribute cards
    this.players.forEach(player => {
      // distribute 7 cards to each player
      player.getCards([...Array(7)].map(() => this.draw()));
    })

    // put first card
    const firstCard = this.drawFirstCard();
    this.putCards([firstCard]);
  }

  drawFirstCard() {
    const firstCard = this.draw();
    if(firstCard.num == null) return this.drawFirstCard();
    return firstCard;
  }

  playTurn() {
    console.log('play turn');
    console.log(
      {
        turn: this.turn,
        card: this.latestCard.name,
        player: this.currentPlayer.name,
        player_card: this.currentPlayer.cards.map(card => card.name),
        finishedPlayers: this.finishedPlayers,
        color: this.color,
        num: this.num,
      }
    )
    let cards = null;
    if(this.drawNum > 0) {
      cards = this.commitWithSingleChance();
      if (cards != null) {
        console.log('put card', cards.map(card => card.name));
        this.putCards(cards);
      }
      else {
        console.log('draw card', this.drawNum);
        for(let i=0; i<this.drawNum; i++) this.currentPlayer.getCard(this.draw());
        this.drawNum = 0;
      }
    } else {
      cards = this.commitWithDoubleChance();
      console.log('put card', cards?.map(card => card.name));
      this.putCards(cards);
    }
    if((this.previousPlayer.cardCount == 1 && !this.previousPlayer.isUno) || (this.previousPlayer.cardCount > 1 && this.previousPlayer.isUno)) {
      this.previousPlayer.getCard(this.draw());
      this.previousPlayer.getCard(this.draw());
    }
    this.nextTurn();
    console.log('end turn');
  }

  shouldEndField() {
    return this.finishedPlayers.length === this.players.length - 1;
  }

  getResult() {
    return {
      winner: this.finishedPlayers[0],
      otherFinishedPlayers: this.finishedPlayers.slice(1),
      looser: this.playablePlayers[0],
    };
  }

  play() {
    this.setUpField();
    while(!this.shouldEndField()) {
      this.playTurn();
    }
    return {
      winner: this.finishedPlayers[0],
      looser: this.playablePlayers[0],
    }
  }
}

export default Stage;
