const Deck = require('./deck')

module.exports = class AiDealer {
  constructor(options) {
    this.name = options.name || 'Dealer'
    this.game = options.game
    this.deck = new Deck;
  }

  requestBetForHand(hand){
    if (hand.cards.length === 0) return 0;
    return 500;
  }

  shuffleDeck(){
    this.deck.shuffle();
  }

  dealCardToHand(hand){
    var card = this.dealCard()
    hand.cards.push(card);
    return card;
  }

  dealCard(){
    return this.deck.cards.pop();
  }

  yourAction(hand){
    var value = hand.value();
    if (value < 17) return 'hit';
    if (value > 16 && value < 19 && hand.getAces().length > 0) return 'hit';
    return 'stand'
  }
}