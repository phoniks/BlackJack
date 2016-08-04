const prompt = require('./prompt')
const formatAsMoney = require('./format_as_money')
const colors = require('colors')

module.exports = class HumanPlayer {
  constructor(options) {
    this.name = options.name;
    this.game = options.game;
    this.bank = 100; // dollars
  }

  requestBetForHand(hand, min, max){
    max = this.bank < max ? this.bank : max;
    console.log(colors.green(this.name+'> you have '+formatAsMoney(this.bank)))
    var ask = this.name+'> How much would you like to bet? ('+formatAsMoney(min)+'..'+formatAsMoney(max)+')';
    var bet = 1;
    while(bet > 0 && bet < min) bet = prompt.forNumber(ask)
    console.log('you\'ve bet '+formatAsMoney(bet))
    return bet;
  }

  yourAction(hand){
    var dealersHand = this.game.dealersHand
    var canDouble = hand.canDouble()
    var canSplit  = hand.canSplit()
    var canInsure = (
      !hand.insurance &&
      dealersHand.cards[1].isAce() &&
      this.bank >= Math.round(hand.bet/2)
    )

    var actions = ['[h]it','[s]tand']
    if (canDouble) actions.push('[d]ouble')
    if (canSplit)  actions.push('s[p]lit')
    if (canInsure) actions.push('[i]nsurance')

    var ask = this.name+'> you have '+hand+'. What would you like to do? '
    ask += '('+actions.join(', ')+')'

    while(true){
      var action = prompt.forString(ask).toLowerCase()
      if (action === 'h' || action === 'hit') return 'hit';
      if (action === 's' || action === 'stand') return 'stand';
      if (canDouble && (action === 'd' || action === 'double')) return 'double';
      if (canSplit  && (action === 'p' || action === 'split')) return 'split';
      if (canInsure && (action === 'i' || action === 'insurance')) return 'insurance'
    }
  }

};