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
     
    var ask = this.name+'> you have '+hand+'. What would you like to do? '
    ask += hand.canDouble() <= 2 ? '([h]it,[s]tand,[d]ouble)' : '([h]it,[s]tand)'

    while(true){
      var action = prompt.forString(ask).toLowerCase()
      // 'hit'
      if (action === 'h' || action === 'hit'){
        return 'hit'
      }
      // 'stand'
      if (action === 's' || action === 'stand'){
        return 'stand'
      }
      if (action === 'd' || action === 'double'){
        return 'double'
      }
    }
  }

};