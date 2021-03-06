## Description

Extend the functionality of the BlackJack game created by Yaseen & Harman
Include betting and more complex casino rules of blackjack.

## Context

Extending the functionality of an existing repo will give us the opportunity to expand our horizons.  We will have to integrate with existing code base, and make new features which are compatible.

## Specifications

## Existing features

Blackjack:
- [x] Dealer and Player characters
Dealer Logic:
- [x] Dealer gives out cards in specific order
     - [x] Dealer gives out:
       - [x] one card face up to player
       - [x] one card face up to Dealer
       - [x] one card face up to player
       - [x] one card face up to Dealer
       - [x] shuffle the deck
- [x] Dealer plays, hitting while 16 or under (17 or more, dealer stays)
  - [x] If dealer hits and busts, player wins  

Player Logic:
- [x] if player gets Blackjack right at the start (Natural), player wins
- [x] Repeat hit or stay until player chooses to stay:
  - [x] Player chooses to hit or stay
- [x] if player goes over 21, player busts

Backend Game Logic:
- [x] Compare player total to dealer total, highest wins
 - [x] If player wins, players get their bet back, doubled

- [x] Repeat until player chooses to stay:
  - [x] Player chooses to hit or stay
 - [x] If hits and bust (go over 21), automatically loses

## New Features
- [x] Betting
 - [x] Place a bet at the beginning of the hand.
 - [x] Handle bets for additional circumstances (double down, split, etc.)
- [x] Multiple players
  - [x] Hot Seat Multiplayer
  - [x] AI Players
- [x] New Game Rules
  - [x] Double Down    
  - [x] Split/Resplit
  - [x] Insurance
- [x] The artifact produced is properly licensed, preferably with the [MIT license][mit-license].

---

<!-- LICENSE -->

<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-sa/4.0/80x15.png" /></a>
<br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License</a>.

[mit-license]: https://opensource.org/licenses/MIT
