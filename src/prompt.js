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
  },

  // prompt.forOption('Would you like to play again?',{
  //   '[y]es': ()=>{ playAgain = true },
  //   '[n]o': ()=>{ playAgain = false },
  // })
  forOption(message, options){
    var expandedOptions = {}
    Object.keys(options).forEach(key => {
      var short = key.match(/\[(\w+)\]/)[1]
      var long = key.replace(/\[|\]/g, '')
      expandedOptions[short] = options[key]
      expandedOptions[long] = options[key]
    })

    message += ' ('+(Object.keys(options).join(','))+')'
    while(true){
      var answer = this.forString(message).toLowerCase()
      if (answer in expandedOptions){
        expandedOptions[answer]()
        return
      }
    }
  }
}