const prompt = require('./prompt')
const formatAsMoney = require('./format_as_money')
const colors = require('colors')

module.exports = class HumanPlayer {
  constructor(options) {
    this.name = options.name;
    this.game = options.game;
    this.bank = 100; // dollars
  }

  requestBet(min, max){
    this.game.report(this.name, 'you have '+formatAsMoney(this.bank))
    var ask = this.name+'> How much would you like to bet? ('+formatAsMoney(min)+'..'+formatAsMoney(max)+')';
    while (true) {
      var bet = prompt.forNumber(ask)
      if (bet > max) console.log(colors.red('thats bet is too hight'))
      else if (bet < min) console.log(colors.red('thats bet is too low'))
      else return bet;
    }
  }

  yourAction(hand){
    var dealersHand = hand.dealersHand
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

    var ask = this.name+'> you have '+hand.toPrivateString()+'. What would you like to do? '
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