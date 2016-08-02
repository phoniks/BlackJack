const _ = require('lodash')
const prompt = require('./prompt')
const colors = require('colors')
const Player = require('./player')
const Hand = require('./hand')
const Deck = require('./deck')
const HumanPlayer = require('./human_player')
const AiPlayer = require('./ai_player')
const AiDealer = require('./ai_dealer')
const formatAsMoney = require('./format_as_money')
const calculateEndgame = require('./calculate_endgame')

//Game Class
module.exports = class Game {
  constructor(){

    this.minBet = 5; // dollars
    this.maxBet = 500; // dollars

    this.roundIndex = 0;

    // this.dealer = new AiPlayer(this);
    this.players = []
    this.setup();
    this.startRound();
  }
  // Sets up the game (prompts user for # of players)
  setup(){
    if (!this.numberOfHuamnPlayers){
      this.numberOfHuamnPlayers = prompt.forNumber("How many human players?");
      console.log('okay '+this.numberOfHuamnPlayers+' human players.')
      this.createHumanPlayers();
    }

    if (!this.numberOfAiPlayers){
      this.numberOfAiPlayers = prompt.forNumber("How many Ai players?");
      console.log('okay '+this.numberOfAiPlayers+' Ai players.')
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
    for (var i=0; i < this.numberOfHuamnPlayers; i++){
      var name = prompt.forString("Give player #"+(i+1)+" a name:")
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
  startRound(){

    //Increments round #
    this.roundIndex++;

    //Display current round #
    console.log('round #'+this.roundIndex+' start!')

    //Collects all cards and returns them to the dealer
    this.hands.forEach(hand => {
      hand.returnToDealer(this.dealer)
    })

    //Checks if the deck has the right number of cards
    if (!this.dealer.deck.isComplete()) {
      throw new Error('dealer isnt playing with a full deck!')
    }

    //Shuffles deck (from deck.js)
    this.dealer.shuffleDeck()

    this.players.forEach(player => {
      if (player === this.dealer) return;
      console.log(player.name+' has '+formatAsMoney(player.bank))
    })

    var dealersHand = new Hand({player: this.dealer})
    this.hands = [dealersHand]

    // Collects wagers from each player && Initiates a hand for each player
    this.players.forEach( player => {
      if (player === this.dealer) return;
      var hand = new Hand({player: player});
      hand.bet = player.requestBetForHand(hand, this.minBet, this.maxBet);
      if (hand.bet >= this.minBet) this.hands.push(hand);
    })

    //Displays the bet for each player as long as they are not the dealer
    this.hands.forEach( hand => {
      if (hand.player === this.dealer) return;
      console.log(hand.player.name+' has bet '+formatAsMoney(hand.bet))
    })


    //Deals everyone 2 cards then displays their hand  
    this.dealEveryoneOneCard();
    this.dealEveryoneOneCard();

    // dealersHand.cards = [
    //   new Card(Card.KING, Card.HEARTS),
    //   new Card(Card.ACE, Card.HEARTS),
    // ]

    this.hands.forEach( hand => {
      console.log(hand.player.name+' was dealt '+hand)
    })

    //Checks if the dealers has blackjack and alerts player if so.
    if (dealersHand.isNaturalBlackjack()){
      console.log('Oh No! Dealer has BlackJack!');
  
    }else{
      //While the hand is not a bust if player action = hit deal a card and console log the hit or if player action = stand console log the stand
      this.hands.forEach(hand => {
        while (!hand.isBust() && hand.cards.length < 5){
          var action = hand.player.yourAction(hand)
          if (action === 'hit'){
            this.dealer.dealCardToHand(hand)
            console.log(colors.green(hand.player.name+' Hit!'))
          }else if (action === 'stand'){
            console.log(colors.green(hand.player.name+' Stand!'))
            return;
          }else{
            throw new Error('UNKONWN ACTION: '+action);
          }
        }
        if (hand.isBust()){
          console.log(colors.red(hand.player.name+' BUSTED! '+hand))
        }
      })

      
      // outputs value of dealers hand
      console.log(colors.green('Dealer has '+dealersHand.value()))
    }

    var endGame = calculateEndgame(this.hands, dealersHand)

    endGame.loosingHands.forEach(hand => {
      console.log(colors.red(hand.player.name+' lost ')+'with '+hand)
      console.log(colors.red(hand.player.name+' lost ')+formatAsMoney(hand.bet))
      hand.player.bank -= hand.bet
      this.dealer.winnings += hand.bet
    })
    endGame.pushingHands.forEach(hand => {
      console.log(colors.yellow(hand.player.name+' pushed ')+'with '+hand)
      console.log(colors.yellow(hand.player.name+' pushed ')+formatAsMoney(hand.bet))
    })
    endGame.winningHands.forEach(hand => {
      console.log(colors.green(hand.player.name+' won! ')+'with '+hand)
      console.log(colors.green(hand.player.name+' won! ')+formatAsMoney(hand.bet))
      var winnings = hand.isNaturalBlackjack() ? (hand.bet * 1.5) : hand.bet
      hand.player.bank += winnings
      this.dealer.winnings -= winnings
    })

    //Asks user if they want to start another round
    var playAgain = prompt.forString('Would you like to play again? (y|n)').toLowerCase();
    if (playAgain === 'y' || playAgain === 'yes'){
      this.startRound()

    }
  }

  //Deals a card to each player
  dealEveryoneOneCard(){
    this.hands.forEach( hand => {
      var card = this.dealer.dealCardToHand(hand);
    });
  }

  
  // numPlayers(){
  //   sum = this.humans + this.ai
  //   if (sum > 5){
  //     throw error
  //   }
  //   else
  //   return sum
  // }

};



// const humans = rl.question("How many human players?")
// const ai = rl.question("How many AI players?")  