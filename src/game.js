const _ = require('lodash')
const prompt = require('./prompt')
const colors = require('colors')
const Round = require('./round')
const Player = require('./player')
const Deck = require('./deck')
const HumanPlayer = require('./human_player')
const AiPlayer = require('./ai_player')
const AiDealer = require('./ai_dealer')
const formatAsMoney = require('./format_as_money')

//Game Class
module.exports = class Game {
  constructor(){
    this.minBet = 5; // dollars
    this.maxBet = 500; // dollars
    this.roundIndex = 1;
    this.players = []
    this.setup();
    this.start();
  }

  report(context, message){
    console.log(colors.green(context+'')+'> '+message)
  }

  prompt(ask){
    return prompt.forString(ask)
  }

  promptForNumber(ask){
    return prompt.forNumber(ask)
  }

  // Sets up the game (prompts user for # of players)
  setup(){
    clear()
    if (!this.numberOfHumanPlayers){
      this.numberOfHumanPlayers = this.promptForNumber("How many human players?");
      this.report('okay', this.numberOfHumanPlayers+' human players.')
      this.createHumanPlayers();
    }

    if (!this.numberOfAiPlayers){
      this.numberOfAiPlayers = this.promptForNumber("How many Ai players?");
      this.report('okay', this.numberOfAiPlayers+' Ai players.')
      this.createAiPlayers();
    }

    this.dealer = new AiDealer({
      name: 'dealer',
      game: this,
    });
    this.players.push(this.dealer);
    this.dealer.deck = new Deck(this.players.length)
    this.hands = [];
  }

  //creates a player with in input/output ability
  createHumanPlayers(){
    for (var i=0; i < this.numberOfHumanPlayers; i++){
      var name = this.prompt("Give player #"+(i+1)+" a name:")
      this.players.push(
        new HumanPlayer({
          game: this,
          name: name
        })
      );
      this.shufflePlayers()
    }
  }

  //Creates an AI player (no prompts, hard coded)
  createAiPlayers(){
    for (var i=0; i < this.numberOfAiPlayers; i++){
      this.players.push(new AiPlayer({
        game: this,
        name: 'Ai '+(i+1),
      }));
      this.shufflePlayers()
    }
  }

  //Shuffles the order of players' turns
  shufflePlayers(){
    this.players = _.shuffle(this.players)
  }

  //Handles rounds of the game
  start(){
    var playAgain
    while(true){
      clear()

      this.round = new Round({
        game: this,
        index: this.roundIndex++,
      })

      prompt.forOption('Would you like to play again?',{
        '[y]es': ()=>{ playAgain = true },
        '[n]o': ()=>{ playAgain = false },
      })
      if (playAgain){ continue }else{ break }
    }
  }
};

function clear(){
  process.stdout.write('\033c'); // clear the screen
}
