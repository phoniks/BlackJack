module.exports = class AiPlayer {
  constructor(options) {
    this.name = options.name;
    this.game = options.game;
  }

  requestBetForHand(hand){
    return 500;
  }

  yourAction(hand){
    var value = hand.value();
    if (value < 17) return 'hit';
    if (value > 16 && value < 19 && hand.getAces().length > 0) return 'hit';
    return 'stand'

    // this.game.dealersHand.cards
  }
}
