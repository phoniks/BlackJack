const prompt = require('./prompt')
const promptForHelp = require('./help')
const Game = require('./game')
const start = () => new Game;

const advanced = function(){
console.log('Advanced help topics: [D]ouble Down, [S]plit, [I]nsurance, [E]ven Money, [B]egin a new game')
  topic = prompt.forString('What would you like to know about?').toUpperCase()
  //Advanced Rules Explanations
    if (topic == 'D'){
    //::Double Down::
    console.log( "\nDouble Down:" )
    console.log( "\nYou may choose to double down on either of your first two cards")
    console.log( "\nDouble your bet and get 1 additional card." )
    console.log( "\nor if your hand has a value of 9 10 or 11")
    advanced()
    }
    //::Split::
    if (topic == 'S'){
    console.log( "\nSplit:" )
    console.log( "\nIf you are dealt a pair you have the option to split them into two hands" )
    console.log( "\nIf you choose to split your original bet is doubled" )
    console.log( "\nYou then play each hand as if it were a normal one" )
    advanced()
    }
    //::Insurance::
    if (topic == 'I'){
    console.log( "\nInsurance:" )
    console.log( "\nIf the dealer's upcard is an Ace they will offer you insurance" )
    console.log( "\nIf you accept the insurance offer:")
    console.log( "\nYou'll put up an additional 50% of your orignal wager as side bet" )
    console.log( "\nIf the dealer has blackjack the insurance pays 2:1 canceling out your original wager" )
    advanced()
    }
    //::Even Money::
    if (topic == 'E'){
    console.log( "\nEven Money:" )
    console.log( "\nThis is essentially a special isntance of insurance" )
    console.log( "\nIt applies when you have a Natural blackjack (Ace + 10)" )
    console.log( "\nAnd the dealer's upcard is an Ace" )
    console.log( "\nYou'll put up an additional 50% of your orignal wager" )
    console.log( "\nIf the dealer has blackjack and pushes you will be payed out at 2:1" )
    advanced()   // }  
    }
    if (topic == 'B'){
        start()
    }
  }


module.exports = advanced