// Imports
const prompt = require('./src/prompt')
const Game = require('./src/game')
const help = require('./src/help')
const start = () => new Game;
//Game Intro

console.log( "Welcome to Yaseen, John and Jared's BlackJack" )
console.log( "Extended from Jrob Harman and Yaseen's work" )

// console.log( "Welcome to Yaseen, Jrob & Harman's BlackJack" )

const promptForAction = function(){
  var option = prompt.forString("'h', or 'HELP' for rules & 's' or 'START' to start a game: \n >>").toUpperCase()
  if (option === 'H' || option === 'HELP'){
    help()
  }
  if (option === 'S' || option === 'START'){
    start()
  }
}

promptForAction()



  // if (humans > 2){
  // console.log('This game has a maximum of 2 human players. Setting human players to 2')
  // humans = 2
  //   }else{
  //   if ((ai + humans) > 5){
  //   console.log('This game has a maximum of 5 total players. Setting total players to max')
  //   let ai = (5 - humans)
  // }
  // console.log('human players: '+human+' AI players: '+ai)
  // }
  //