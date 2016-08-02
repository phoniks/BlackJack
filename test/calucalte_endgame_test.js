const expect = require('expect.js')
const Hand = require('../src/hand')
const Card = require('../src/card')
const calculateEndgame = require('../src/calculate_endgame')

describe('calculateEndgame', function() {
  it('shouls calculate the end game correctly', function() {
    var dealersHand = new Hand({
      cards: [
        new Card(Card.ACE, Card.HEARTS),
        new Card(Card.KING, Card.HEARTS),
      ]
    });
    var hands = [
      new Hand({
        cards: [
          new Card(Card.ACE, Card.SPADES),
          new Card(Card.KING, Card.SPADES),
        ]
      }),
      new Hand({
        cards: [
          new Card(5, Card.DIAMONDS),
          new Card(Card.KING, Card.DIAMONDS),
        ]
      }),
      new Hand({
        cards: [
          new Card(2, Card.SPADES),
          new Card(3, Card.SPADES),
        ]
      }),
    ]
    var {loosingHands, pushingHands, winningHands} = calculateEndgame(hands, dealersHand)


    // console.log('dealersHand', dealersHand+'')
    // console.log('loosingHands', loosingHands.map(hand => hand+''))
    // console.log('pushingHands', pushingHands.map(hand => hand+''))
    // console.log('winningHands', winningHands.map(hand => hand+''))


    expect(loosingHands.length).to.eql(2)
    expect(pushingHands.length).to.eql(1)
    expect(winningHands.length).to.eql(0)
  });

  it('shouls calculate the end game correctly', function() {
    var dealersHand = new Hand({
      cards: [
        new Card(8, Card.HEARTS),
        new Card(Card.KING, Card.HEARTS),
        new Card(Card.KING, Card.SPADES),
      ]
    });

    var hands = [
      new Hand({
        cards: [
          new Card(Card.ACE, Card.SPADES),
          new Card(Card.KING, Card.SPADES),
        ]
      }),
      new Hand({
        cards: [
          new Card(5, Card.DIAMONDS),
          new Card(Card.KING, Card.DIAMONDS),
          new Card(Card.KING, Card.CLUBS),
        ]
      }),
      new Hand({
        cards: [
          new Card(2, Card.SPADES),
          new Card(3, Card.SPADES),
        ]
      }),
    ]
    var {loosingHands, pushingHands, winningHands} = calculateEndgame(hands, dealersHand)

    // console.log('dealersHand', dealersHand+'')
    // console.log('loosingHands', loosingHands.map(hand => hand+''))
    // console.log('pushingHands', pushingHands.map(hand => hand+''))
    // console.log('winningHands', winningHands.map(hand => hand+''))

    expect(loosingHands.length).to.eql(1)
    expect(pushingHands.length).to.eql(0)
    expect(winningHands.length).to.eql(2)
  });
});