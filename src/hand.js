const _ = require('lodash');
const formatAsMoney = require('./format_as_money')

module.exports = class Hand {
  constructor(options){
    this.game = options.game;
    this.player = options.player;
    this.cards = options.cards || [];
    this.bet = options.bet || 0;
  }

  toString(){
    return (
      (this.cards.length === 0 ? '(empty hand)' : '('+this.cards.join(' ')+')')+
      '='+this.value()+
      ' | '+formatAsMoney(this.bet)
    )
  }

  report(message){
    this.game.report(this.player.name+' '+this, message);
    // this.game.report(
    //   'Player: '+this.player.name+"\n"+
    //   'Hand: '+'('+this.cards.join(' ')+')='+this.value()+"\n"+
    //   'Bet: '+this.bet+"\n",
    //   message
    // )
  }

  prompt(ask){
    return this.game.prompt(this+' '+ask)
  }

  promptForNumber(ask){
    return this.game.promptForNumber(this+' '+ask)
  }

  value(){
    let aces = this.getAces()
    let sum = this.cards.reduce( (total, card) => total + card.value(), 0 )
    while (sum > 21 && aces.length > 0){
      aces.pop();
      sum -= 10;
    }
    return sum;
  }

  isBust(){
    return this.value() > 21
  }

  isPlayable(){
    return !this.stood && !this.isBust() && this.cards.length < 5
  }

  returnToDealer(dealer){
    while (this.cards.length !== 0){
      dealer.deck.cards.push(this.cards.pop())
    }
  }
  getAces(){
    return this.cards.filter(card => card.isAce())
  }

  isNaturalBlackjack(){
    return this.value() === 21 && this.cards.length === 2;
  }

  canDouble(){
    return this.cards.length <= 2 && this.player.bank >= (this.bet *2)
  }

  canSplit(){
    return (
      this.cards.length === 2 &&
      this.cards[0].rank === this.cards[1].rank &&
      this.player.bank >= this.bet
    )
  }

  split(){
    if (!this.canSplit()){ throw new Error('cannot split hand '+this)}
    var newHand = new Hand({
      game: this.game,
      player: this.player,
      cards: [this.cards.shift()],
      bet: this.bet,
    })
    this.player.bank -= this.bet
    return newHand;
  }
}
