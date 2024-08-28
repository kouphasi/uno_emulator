

import NumCard from '../model/num_card.js';
import specialCardCreators from './special_card_creators.js';
import colors from '../constants/colors.js';

const availableNumbers = Array.from({length: 10}, (_, i) => i);

const numCardCreators = colors.map( color => availableNumbers.map( num => () => new NumCard({name: `${color.name}${num}`, num, color}))).flat();

const CardCreators = [
  ...numCardCreators,
  ...specialCardCreators,
];

export default CardCreators;
