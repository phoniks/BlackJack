module.exports = class AiPlayer {
  constructor(options) {
    this.name = options.name;
    this.game = options.game;
    this.bank = 100; // dollars
  }

  requestBet(min, max){
    var bet = Math.round(max / 2)
    return bet < min ? min : bet
  }

  yourAction(hand){
    var value = hand.value();
    if (hand.canSplit()) return 'split'
    // if (hand.canDouble()) return 'double'
    if (value < 17) return 'hit';
    if (value > 16 && value < 19 && hand.getAces().length > 0) return 'hit';
    return 'stand'

    // this.game.dealersHand.cards
  }
}
