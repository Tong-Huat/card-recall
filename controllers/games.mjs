/*
 * ========================================================
 * ========================================================
 * ========================================================
 * ========================================================
 *
 *                  Card Deck Functions
 *
 * ========================================================
 * ========================================================
 * ========================================================
 */

// get a random index from an array given it's size
const getRandomIndex = function (size) {
  return Math.floor(Math.random() * size);
};

// cards is an array of card objects
const shuffleCards = function (cards) {
  let currentIndex = 0;

  // loop over the entire cards array
  while (currentIndex < cards.length) {
    // select a random position from the deck
    const randomIndex = getRandomIndex(cards.length);

    // get the current card in the loop
    const currentItem = cards[currentIndex];

    // get the random card
    const randomItem = cards[randomIndex];

    // swap the current card and the random card
    cards[currentIndex] = randomItem;
    cards[randomIndex] = currentItem;

    currentIndex += 1;
  }

  // give back the shuffled deck
  return cards;
};

const makeDeck = function () {
  // create the empty deck at the beginning
  const deck = [];

  const suits = ['hearts', 'diamonds', 'clubs', 'spades'];

  let suitIndex = 0;
  while (suitIndex < suits.length) {
    // make a variable of the current suit
    const currentSuit = suits[suitIndex];

    // loop to create all cards in this suit
    // rank 1-13
    let rankCounter = 1;
    while (rankCounter <= 13) {
      let cardName = rankCounter;

      // 1, 11, 12 ,13
      if (cardName === 1) {
        cardName = 'ace';
      } else if (cardName === 11) {
        cardName = 'jack';
      } else if (cardName === 12) {
        cardName = 'queen';
      } else if (cardName === 13) {
        cardName = 'king';
      }

      // make a single card object variable
      const card = {
        name: cardName,
        suit: currentSuit,
        rank: rankCounter,
      };

      // add the card to the deck
      deck.push(card);

      rankCounter += 1;
    }
    suitIndex += 1;
  }

  return deck;
};

/*
 * ========================================================
 * ========================================================
 * ========================================================
 * ========================================================
 *
 *                  Controller Functions
 *
 * ========================================================
 * ========================================================
 * ========================================================
 */

export default function initGamesController(db) {
  // render the main page
  // const index = (request, response) => {
  //   response.render('games/index');
  // };
  let player1Hand;
  let player2Hand;
  let result;
  let player1Score = 0;
  let player2Score = 0;

  const determineWinner = () => {
    if (player1Hand.rank === player2Hand.rank) {
      result = 'Its a DRAW!';
    } else if (player1Hand.rank > player2Hand.rank) {
      result = 'Player 1 Won!';
      player1Score += 1;
    } else {
      result = 'Player 2 Won!';
      player2Score += 1;
    }
    return result;
  };
  // create a new game. Insert a new row in the DB.
  const create = async (request, response) => {
    // deal out a new shuffled deck for this game.
    const cardDeck = shuffleCards(makeDeck());
    player1Hand = cardDeck.pop();
    player2Hand = cardDeck.pop();
    console.log('player1Hand :>> ', player1Hand);
    console.log('player1Hand.rank :>> ', player1Hand.rank);
    console.log('player2Hand :>> ', player2Hand);
    console.log('player2Hand.rank :>> ', player2Hand.rank);
    determineWinner();
    const newGame = {
      gameState: {
        cardDeck,
        player1Hand,
        player2Hand,
        player1Score,
        player2Score,
        result,
      },
    };

    try {
      // run the DB INSERT query
      const createNewGame = await db.Game.create(newGame);

      // console.log('userCount :>> ', userCount);
      const player1 = await db.User.findOne({
        where: {
          id: request.cookies.userId,
        },
      });
      console.log('player1 id :>> ', player1);
      // send the new game back to the user.
      // dont include the deck so the user can't cheat
      response.send({
        id: createNewGame.id,
        player1Hand: createNewGame.gameState.player1Hand,
        player2Hand: createNewGame.gameState.player2Hand,
        player1Score: createNewGame.gameState.player1Score,
        player2Score: createNewGame.gameState.player2Score,
        result: createNewGame.gameState.result,
      });
    } catch (error) {
      response.status(500).send(error);
    }
  };

  // deal two new cards from the deck.
  const deal = async (request, response) => {
    try {
      // get the game by the ID passed in the request
      const game = await db.Game.findByPk(request.params.id);

      // make changes to the object
      player1Hand = game.gameState.cardDeck.pop();
      player2Hand = game.gameState.cardDeck.pop();
      determineWinner();

      // update the game with the new info
      await game.update({
        gameState: {
          cardDeck: game.gameState.cardDeck,
          player1Hand,
          player2Hand,
          player1Score,
          player2Score,
          result,
        },

      });

      // send the updated game back to the user.
      // dont include the deck so the user can't cheat
      response.send({
        id: game.id,
        player1Hand: game.gameState.player1Hand,
        player2Hand: game.gameState.player2Hand,
        player1Score: game.gameState.player1Score,
        player2Score: game.gameState.player2Score,
        result: game.gameState.result,
      });
    } catch (error) {
      response.status(500).send(error);
    }
  };

  const refresh = async (request, response) => {
    try {
      const updatedGame = await db.Game.findOne({
        where: {
          id: request.body.id,
        },
      });
      response.send({
        id: updatedGame.id,
        player1Hand: updatedGame.gameState.player1Hand,
        player2Hand: updatedGame.gameState.player2Hand,
        player1Score: updatedGame.gameState.player1Score,
        player2Score: updatedGame.gameState.player2Score,
        result: updatedGame.gameState.result,
      });
    }
    catch (error) {
      console.log(error);
    }
  };
  // return all functions we define in an object
  // refer to the routes file above to see this used
  return {
    deal,
    create,
    refresh,
  };
}
