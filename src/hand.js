const _ = require('lodash');

module.exports = class Hand {
  constructor(options){
    this.player = options.player;
    this.cards = [];
  }

  toString(){
    return '['+this.cards.join(' ][')+' ]'
  }

  isBust(){
    let aces = this.cards.filter(card => card.isAce()) 
    let sum = this.cards.reduce( (total, card) => total + card.value(), 0 )
    while (sum > 21 && aces.length > 0){
      aces.pop();
      sum -= 10;
    }
    return sum > 21
  }
}