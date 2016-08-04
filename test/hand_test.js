const expect = require('expect.js')
const Hand = require('../src/hand')
const Card = require('../src/card')

describe('Hand', function() {
  describe('#canDouble', function() {
    it('should only double when you have <=2 and sufficent bank', function(){
      var hand = new Hand({
        player: {bank: 100},
        cards: [{},{}],
      });
      hand.bet = 25;
      expect(hand.canDouble()).to.be(true)

      var hand = new Hand({
        player: {bank: 100},
        cards: [{},{}],
      });
      hand.bet = 75;
      expect(hand.canDouble()).to.be(false)

      var hand = new Hand({
        player: {bank: 100},
        cards: [{},{},{}],
      });
      hand.bet = 5;
      expect(hand.canDouble()).to.be(false)
    })
  })

  describe('#canSplit', function(){

    it('[5❤ ][5️️♦ ]️ should be splittable', function(){
      var hand = new Hand({
        player: {bank: 1000},
        bet: 100,
        cards: [
          new Card(5, Card.HEARTS),
          new Card(5, Card.CLUBS)
        ],
      });
      expect(hand.canSplit()).to.be(true)
    })

    it('[5❤ ][5️️♦ ] without the bank,️ should not be splittable', function(){
      var hand = new Hand({
        player: {bank: 100},
        bet: 1000,
        cards: [
          new Card(5, Card.HEARTS),
          new Card(5, Card.CLUBS)
        ],
      });
      expect(hand.canSplit()).to.be(false)
    })

    it('[7❤ ][5️️♦ ]️ should not be splittable', function(){
      var hand = new Hand({
        player: {bank: 1000},
        bet: 100,
        cards: [
          new Card(7, Card.HEARTS),
          new Card(5, Card.CLUBS)
        ]
      })
      expect(hand.canSplit()).to.be(false)
    })

    it('[7❤ ][5️️♦ ]️[5❤ ] should not be splittable', function(){
      var hand = new Hand({
        player: {bank: 1000},
        cards: [
          new Card(7, Card.HEARTS),
          new Card(5, Card.CLUBS),
          new Card(5, Card.HEARTS)
        ]
      })
      expect(hand.canSplit()).to.be(false)
    })


  });

  describe('#isBust', function() {


    it('[K❤️ ][A♦️ ] should not be a bust', function() {
      var hand = new Hand({});
      hand.cards = [
        new Card(Card.KING, Card.HEARTS),
        new Card(Card.ACE, Card.DIAMONDS),
      ]
      expect(hand.isBust()).to.be(false)
    });

    it('[K❤️ ][K♦️ ][7♠ ] should not be a bust', function() {
      var hand = new Hand({});
      hand.cards = [
        new Card(Card.KING, Card.HEARTS),
        new Card(Card.KING, Card.DIAMONDS),
        new Card(7, Card.SPADES),
      ]
      expect(hand.isBust()).to.be(true)
    });

    it('aces should be counted as 11 or 1', function() {
      var hand = new Hand({});
      hand.cards = [
        new Card(Card.ACE, Card.HEARTS),
        new Card(Card.ACE, Card.DIAMONDS),
        new Card(Card.ACE, Card.SPADES),
        new Card(Card.ACE, Card.CLUBS),
      ]
      expect(hand.isBust()).to.be(false)

      hand.cards.push(new Card(Card.KING, Card.CLUBS))
      expect(hand.isBust()).to.be(false)

      hand.cards.push(new Card(Card.KING, Card.DIAMONDS))
      expect(hand.isBust()).to.be(true)
    });
  })

  describe('#isPlayable', function() {
    it('[A❤️ ][A♠ ️] should be playable', function() {
      var hand = new Hand({
        player: {}
      });
      hand.cards = [
        new Card(Card.ACE, Card.HEARTS),
        new Card(Card.ACE, Card.SPADES)
      ]
      expect(hand.isPlayable()).to.be(true)
    })
    it('[K❤️ ][Q♠ ️][J♠ ] not should be playable', function() {
      var hand = new Hand({
        player: {}
      });
      hand.cards = [
        new Card(Card.KING, Card.HEARTS),
        new Card(Card.QUEEN, Card.SPADES),
        new Card(Card.JACK, Card.SPADES)
      ]
      expect(hand.isPlayable()).to.be(false)
    })
  })
});