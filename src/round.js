const colors = require('colors')
const Hand = require('./hand')
const Card = require('./card')
const formatAsMoney = require('./format_as_money')
const calculateEndgame = require('./calculate_endgame')

class Round {
  constructor(options){
    this.index = options.index
    this.game = options.game
    this.start();
  }

  start(){
    console.log('round #'+this.index, 'start!')
    this.ensureFullDeck()
    this.shuffelDeck()
    this.reportPlayerStatus()
    this.askWhoIsIn()
    this.dealEveryoneTwoCards()
    this.reportTableStatus()
    this.playersTakeActions()
    this.calculateEndgame()
    this.reportPlayerStatus()
    this.cleanup()
  }

  ensureFullDeck(){
    //Checks if the deck has the right number of cards
    if (!this.game.dealer.deck.isComplete()) {
      throw new Error('dealer isnt playing with a full deck!')
    }
  }

  shuffelDeck(){
    //Shuffles deck (from deck.js)
    this.game.dealer.shuffleDeck()
  }

  reportPlayerStatus(){
    this.game.players.forEach(player => {
      if (player === this.game.dealer) return
      this.game.report(player.name, 'has '+formatAsMoney(player.bank))
    })
  }

  askWhoIsIn(){
    this.hands = []

    this.dealersHand = new Hand({
      game: this.game,
      player: this.game.dealer
    })

    // Collects wagers from each player && Initiates a hand for each player
    this.game.players.forEach( player => {
      if (player === this.game.dealer) return;
      var min = this.game.minBet
      var max = player.bank < this.game.maxBet ? player.bank : this.game.maxBet;
      if (max < min) { return }
      var bet = player.requestBet(min, max);
      if (!bet || bet < min || bet > max) { return };
      var hand = new Hand({
        game: this.game,
        player: player,
        bet: bet,
      });
      player.bank -= hand.bet
      hand.dealersHand = this.dealersHand
      this.hands.push(hand);
    })

    if (this.hands.length===0){
      console.log(colors.red('The house just won: ')+colors.green(formatAsMoney(this.game.dealer.winnings)))
      console.log(colors.red('No players have enough bank to play. Get out!'));
      process.exit()
    }

    this.hands.push(this.dealersHand);
  }

  dealEveryoneOneCard(){
    this.hands.forEach( hand => {
      var card = this.game.dealer.dealCardToHand(hand);
    });
  }

  dealEveryoneTwoCards(){
    this.dealEveryoneOneCard();
    this.dealEveryoneOneCard();
  }

  reportTableStatus(){
    this.game.report('Dealer', 'has '+this.dealersHand.toPublicString())

    this.hands.forEach( hand => {
      if (hand.player === this.game.dealer) return
      var cards = hand.toPublicString()
      var bet = formatAsMoney(hand.bet)
      this.game.report(hand.player.name,' has bet '+bet+' with '+cards)
    })
  }

  playersTakeActions(){
    //While the hand is not a bust if player action = hit deal a card and console log the hit or if player action = stand console log the stand
    // this.hands.forEach(hand => {
    this.game.players.forEach(player => {
      const playableHands = () => {
        return this.hands.filter(hand =>
          hand.player === player && hand.isPlayable()
        )
      }

      while (true){
        var hands = playableHands()
        if (hands.length === 0) break;
        var hand = hands[0]
        this.game.report('Dealers hand', this.dealersHand.toPublicString())
        var action = hand.player.yourAction(hand)
        if (action === 'hit'){
          this.game.dealer.dealCardToHand(hand)
          hand.report('Hit!')
        }else if (action === 'stand'){
          hand.report('Stand!')
          hand.stood = true
        }else if (action === 'double'){
          this.game.dealer.dealCardToHand(hand)
          hand.player.bank -= hand.bet;
          hand.bet += hand.bet
          hand.report('doubled their bet')
        }else if (action === 'split'){
          var newHand = hand.split()
          this.hands.push(newHand) // TODO inject in order
          this.game.dealer.dealCardToHand(hand);
          this.game.dealer.dealCardToHand(newHand);
          hand.report('split their hand into '+hand.toPublicString()+' '+newHand.toPublicString())
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
  }

  calculateEndgame(){
    this.game.report('Dealers hand', this.dealersHand.toPrivateString())

    var endGame = calculateEndgame(this.hands, this.dealersHand)

    endGame.loosingHands.forEach(hand => {
      hand.report('lost '+formatAsMoney(hand.bet)+' with '+hand.toPrivateString())
      this.game.dealer.winnings += hand.bet
    })
    endGame.pushingHands.forEach(hand => {
      hand.report('pushed '+formatAsMoney(hand.bet)+' with '+hand.toPrivateString())
      hand.player.bank += hand.bet
    })
    endGame.winningHands.forEach(hand => {
      hand.report('won! '+formatAsMoney(hand.bet)+' with '+hand.toPrivateString())
      hand.player.bank += hand.bet
      var winnings = hand.isNaturalBlackjack() ? (hand.bet * 1.5) : hand.bet
      hand.player.bank += winnings
      this.game.dealer.winnings -= winnings
    })

    if (this.dealersHand.isNaturalBlackjack()){
      this.hands.filter(hand => hand.insurance).forEach(hand => {
        var winnings = hand.insurance * 2
        hand.report('won insurance! '+formatAsMoney(winnings))
        hand.player.bank += winnings
        this.game.dealer.winnings -= winnings
      })
    }
  }

  cleanup(){
    this.hands.forEach(hand => {
      while(hand.cards.length > 0){
        this.game.dealer.deck.cards.push(hand.cards.shift())
      }
    })
  }

}
module.exports = Round;
