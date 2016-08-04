const rl = require('readline-sync')
const colors = require('colors')

module.exports = {
  forString(question){
    return rl.question(colors.green(question+' '));
  },

  forNumber(question){
    var number
    while (isNaN(number) || typeof number !== 'number'){
      number = parseInt(this.forString(question), 10);
    }
    return number
  }
}