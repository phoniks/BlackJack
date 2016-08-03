const rl = require('readline-sync')
const colors = require('colors')

module.exports = {
  forString(question){
    return rl.question(colors.green(question+' '));
  }

  forNumber(question){
    return parseInt(this.forString(question), 10);
  }

  forAction(){
    
  }
}