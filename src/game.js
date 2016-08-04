const _ = require('lodash')
const prompt = require('./prompt')
const colors = require('colors')
const Player = require('./player')
const Hand = require('./hand')
const Deck = require('./deck')
const Card = require('./card')
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

    this.players = []
    this.setup();
    this.startRound();
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
  startRound(){

    //Increments round #
    this.roundIndex++;

    //Display current round #
    this.report('round #'+this.roundIndex, 'start!')

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
      this.report(player.name, 'has '+formatAsMoney(player.bank)+' in their bank')
    })

    this.dealersHand = new Hand({
      game: this,
      player: this.dealer
    })
    this.hands = []

    // Collects wagers from each player && Initiates a hand for each player
    this.players.forEach( player => {
      if (player === this.dealer) return;
      var hand = new Hand({
        game: this,
        player: player
      });
      hand.bet = player.requestBetForHand(hand, this.minBet, this.maxBet);
      player.bank -= hand.bet
      if (hand.bet >= this.minBet) this.hands.push(hand);
    })

    //Displays the bet for each player as long as they are not the dealer
    this.hands.forEach( hand => {
      hand.report('has bet '+formatAsMoney(hand.bet))
    })

    this.hands.push(this.dealersHand);


    //Deals everyone 2 cards then displays their hand
    this.dealEveryoneOneCard();
    this.dealEveryoneOneCard();

    // HACK to test inssurance
    // this.dealersHand.cards = [
    //   new Card(Card.KING, Card.HEARTS),
    //   new Card(Card.ACE, Card.HEARTS)
    // ]

    this.hands.forEach( hand => {
      this.report(hand.player.name, 'was dealt 🂠 '+hand.hideFirstDealt())
    })

    //While the hand is not a bust if player action = hit deal a card and console log the hit or if player action = stand console log the stand
    // this.hands.forEach(hand => {
    this.players.forEach(player => {
      const playableHands = () => {
        return this.hands.filter(hand =>
          hand.player === player && hand.isPlayable()
        )
      }

      while (true){
        var hands = playableHands()
        console.log('----> '+player.name+'>>> '+hands.join(' / '))
        if (hands.length === 0) break;
        var hand = hands[0]
        this.report('Dealer is showing ', this.dealersHand.hideFirstDealt())
        var action = hand.player.yourAction(hand)
        if (action === 'hit'){
          this.dealer.dealCardToHand(hand)
          hand.report('Hit!')
        }else if (action === 'stand'){
          hand.report('Stand!')
          hand.stood = true
        }else if (action === 'double'){
          this.dealer.dealCardToHand(hand)
          hand.player.bank -= hand.bet;
          hand.bet += hand.bet
          hand.report('doubled their bet')
        }else if (action === 'split'){
          var newHand = hand.split()
          this.hands.push(newHand) // TODO inject in order
          this.dealer.dealCardToHand(hand);
          this.dealer.dealCardToHand(newHand);
          hand.report('split their hand into '+hand+' '+newHand)
        }else if (action === 'insurance'){
          // TODO ask for side bet up to half of hand.bet
          hand.insurance = Math.round(hand.bet/2)
          hand.player.bank -= hand.insurance
          hand.report('bought insurance for '+hand.insurance)
        }else{
          throw new Error('UNKONWN ACTION: '+action);
        }
        if (hand.isBust()){
          hand.report('BUSTED!')
        }
      }
    })

    var endGame = calculateEndgame(this.hands, this.dealersHand)

    endGame.loosingHands.forEach(hand => {
      hand.report('lost '+formatAsMoney(hand.bet)+' with '+hand)
      this.dealer.winnings += hand.bet
    })
    endGame.pushingHands.forEach(hand => {
      hand.report('pushed '+formatAsMoney(hand.bet)+' with '+hand)
      hand.player.bank += hand.bet
    })
    endGame.winningHands.forEach(hand => {
      hand.report('won! '+formatAsMoney(hand.bet)+' with '+hand)
      var winnings = hand.isNaturalBlackjack() ? (hand.bet * 1.5) : hand.bet
      hand.player.bank += winnings
      this.dealer.winnings -= winnings
    })

    if (this.dealersHand.isNaturalBlackjack()){
      this.hands.filter(hand => hand.insurance).forEach(hand => {
        var winnings = hand.insurance * 2
        hand.report('won insurance! '+formatAsMoney(winnings))
        hand.player.bank += winnings
        this.dealer.winnings -= winnings
      })
    }

    //Asks user if they want to start another round
    var playAgain = this.prompt('Would you like to play again? (y|n)').toLowerCase();
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