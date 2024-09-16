import colors from '../constants/colors.js';

class Player {
  cards = [];
  isUno = false;
  constructor(name) {
    this.name = name;
  }

  get cardCount() {
    return this.cards.length;
  }

  getCards(cards) {
    this.cards = [...this.cards, ...cards];
  }

  getCard(card) {
    console.log(`${this.name} got ${card.name}`);
    this.cards.push(card);
    this.isUno = false;
  }

  removeCard(card) {
    this.cards = this.cards.filter(c => c !== card);
  }

  sayUno() {
    this.isUno = Math.random() < 0.5;
    if(this.isUno) {
      console.log(`${this.name} said UNO!`);
    }
  }

  canPutCards(stage) {
    return this.cards.filter(card => card.canPut(stage));
  }

  canPutAnotherCards(selectedCard) {
    return this.cards.filter(card => card.canPutAnother(selectedCard));
  }

  selectFirstCard(stage) {
    const cards = this.canPutCards(stage);
    if(cards.length === 0) {
      return null;
    }
    // Card Selection Logic
    const selectedCard = cards[Math.floor(Math.random() * cards.length)];
    this.removeCard(selectedCard);
    return selectedCard;
  }

  selectAnotherCards(selectedCards) {
    const latestCard = selectedCards[selectedCards.length - 1];
    const cards = this.canPutAnotherCards(latestCard);
    // Card Selection Logic
    const newCard = cards.length ? cards[Math.floor(Math.random() * cards.length)] : null;
    this.removeCard(newCard);

    const bindSelectedCards = [...selectedCards];
    if(newCard) {
      bindSelectedCards.push(newCard);
      return this.selectAnotherCards(bindSelectedCards);
    }
    return bindSelectedCards.flat();
  }

  selectCards(stage) {
    const firstCard = this.selectFirstCard(stage);
    return firstCard ? this.selectAnotherCards([firstCard]) : null;
  }

  selectColor() {
    // Color Selection Logic
    return colors[Math.floor(Math.random() * colors.length)];
  }

  putCards(stage) {
    const cards = this.selectCards(stage);

    // outputs
    if(cards === null) {
      console.log(`${this.name} cannot put any card`);
      return null
    } else {
      console.log(`${this.name} put ${cards.map(card => card.name)}`);
      console.log('after put card num', this.cards.length);
      if(this.cards.length === 1 && !this.isUno) { console.log('passed Uno', this.cards.length); this.sayUno(); }
      return cards;
    }
  }
}

export default Player;
