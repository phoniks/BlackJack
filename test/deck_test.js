const expect = require('expect.js')
const Deck = require('../src/deck')

describe('Deck', function() {
  describe('new', function() {
    it('2 players should use 52 cards', function() {
      var deck = new Deck(2)
      expect(deck.cards.length).to.be(52)
    });

    it('4 players should use 104 cards', function() {
      var deck = new Deck(4)
      expect(deck.cards.length).to.be(104)
    });

    it('8 players should use 208 cards', function() {
      var deck = new Deck(8)
      expect(deck.cards.length).to.be(208)
    });
  })
});