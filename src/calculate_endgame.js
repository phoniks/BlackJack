const calculateEndgame = function(hands, dealersHand){

  hands = hands.filter(hand => hand !== dealersHand)

  // Defines a losing hand
  var loosingHands = hands.filter(hand => {
    return (
      hand.isBust() || (
        hand.cards.length < 5 && 
        !dealersHand.isBust() &&
        hand.value() < dealersHand.value() 
      )
    )
  })

  //Defines a hand that pushes
  var pushingHands = hands.filter(hand => {
    return (
      !dealersHand.isBust() &&
      !hand.isBust() && 
      hand.cards.length < 5 &&
      hand.value() === dealersHand.value() 
    );
  })

  // Defines a winning hand
  var winningHands = hands.filter(hand => {
    return (
      !hand.isBust() && 
      (
        hand.cards.length === 5 ||
        dealersHand.isBust() ||
        hand.value() > dealersHand.value()
      )
    );
  })

  // var dealerWins = !dealersHand.isBust() && winningHands.filter(hand => hand.value() > dealersHand.value()).length === 0;
  // if (dealerWins){
  //   winningHands.push(dealersHand)
  // }else{
  //   loosingHands.push(dealersHand)
  // }

  return {
    loosingHands,
    pushingHands,
    winningHands,
  }
}

module.exports = calculateEndgame
