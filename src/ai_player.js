module.exports = class AiPlayer {
  constructor(options) {
    this.name = options.name;
    this.game = options.game;
    this.bank = 100; // dollars
  }

  requestBetForHand(hand, min, max){
    return min; // dollars
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
