const prompt = require('./prompt')
const colors = require('colors')
const advanced = require('./advanced')
const Game = require('./game')
const start = () => new Game;

const promptForHelp = function(){
  console.log("This is an interactive help menu. For basic rules please press 'h'. For a list of advanced rules please press '?' Press 'B' or 'BEGIN' to exit\n What'll it be?")
  var response = prompt.forString('>').toUpperCase();
  if (response === 'B' || response === 'BEGIN'){
    start()
  }
  if (response === 'JARED'){
    console.log(colors.green('JARED IS THE MAN!'))
    returnS;
  }
   if (response == 'H'){
   console.log( "Your goal is to get a score of 21" )
   console.log( "\nIf you go over 21, you automatically lose" )
   console.log( "\nYou're playing against the dealer NOT the other players" )
   console.log( "\nIf your score matches the dealers you don't win or lose any money (Push)" )
  //Card Values Explanation
   console.log( "\nCard Values:" )
   console.log( "\nCards 2-10 are Face Value" )
   console.log( "\nJack, Queen, King are worth 10 Points each." )
   console.log( "\nAce can be either 11 or 1 depending on current score." )
   console.log( "\nType 'H' to Hit (Get another card) or 'S' to Stay\n" )
   }
   if (response == '?'){
   advanced()
   }
}

module.exports = promptForHelp


// }else{

//   else if (response = 'quit'){
//     index.initialize()
//   }


//    console.log('Unable to interpret input. Please try again.')
//   }
// }