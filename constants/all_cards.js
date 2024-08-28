

import NumCard from '../model/num_card.js';
import specialCards from './special_cards.js';
import colors from '../constants/colors.js';

const availableNumbers = Array.from({length: 10}, (_, i) => i);

const numCards = colors.map( color => availableNumbers.map( num => new NumCard({name: `${color.name}${num}`, num, color}))).flat();

const allCards = [
  ...numCards,
  ...specialCards,
];

export default allCards;
