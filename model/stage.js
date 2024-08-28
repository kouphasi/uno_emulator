
import allCards from '../constants/all_cards.js';

class Stage {
  players = [];
  turn = 1;
  currentPlayerIndex = 0;
  fieldCards = [];
  isOpposite = false;
  finishedPlayers = [];
  num = 0;
  color = null;

  constructor(players) {
    this.players = players;
  }

  get playablePlayers() {
    return this.players.filter(player => !this.finishedPlayers.includes(player));
  }

  get currentPlayer() {
    return this.players[this.playerIndex];
  }

  get playerIndex() {
    const playerCount = this.players.length;
    return this.currentPlayerIndex % playerCount < 0
      ? this.currentPlayerIndex % playerCount + playerCount
      : this.currentPlayerIndex % playerCount;
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
    return allCards[Math.floor(Math.random() * allCards.length)];
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

  putCard(card) {
    if(card == null) return;
    card.handleCard(this);
    this.fieldCards.push(card);
  }

  nextTurn(card) {
    this.turn++;
    if(this.currentPlayer.cardCount === 0) this.finishPlayer(this.currentPlayer);
    this.nextPlayerIndex(card?.step || 1);
  }

  commitWithSingleChance() {
    return this.currentPlayer.putCard(this);
  }

  commitWithDoubleChance() {
    const firstCard = this.currentPlayer.putCard(this);
    if(firstCard != null) return firstCard;
    this.currentPlayer.getCard(this.draw());
    return this.currentPlayer.putCard(this);
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
    this.putCard(firstCard);
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
    let card = null;
    if(this.drawNum > 0) {
      card = this.commitWithSingleChance();
      // if (card != null) this.putCard(card);
      if (card != null) {
        console.log('put card', card);
        this.putCard(card);
      }
      else {
        console.log('draw card', this.drawNum);
        this.drawNum.forEach(() => this.currentPlayer.getCard(this.draw()));
        this.drawNum = 0;
      }
    } else {
      card = this.commitWithDoubleChance();
      console.log('put card', card);
      this.putCard(card);
    }
    this.nextTurn(card);
    console.log('end turn');
  }

  shouldEndField() {
    return this.finishedPlayers.length === this.players.length - 1;
  }

  getResult() {
    return {
      winner: this.finishedPlayers[0],
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
