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
  const symbols = ['❤️', '♦️', '♣', '♠'];
 
  // Loop over the suits array
  for (let suitIndex = 0; suitIndex < suits.length; suitIndex += 1) {
    // Store the current suit in a variable
    const currentSuit = suits[suitIndex];
    const currentSymbol = symbols[suitIndex];
    // Loop from 1 to 13 to create all cards for a given suit
    for (let rankCounter = 1; rankCounter <= 13; rankCounter += 1) {
      // By default, the card name is the same as rankCounter
      let cardName = `${rankCounter}`;
      let cardDisplay = `${rankCounter}`;
      let cardColor = 'red';
      // If rank is 1, 11, 12, or 13, set cardName to the ace or face card's name
      if (cardName === '1') {
        cardName = 'ace';
        cardDisplay = 'A';
      } else if (cardName === '11') {
        cardName = 'jack';
        cardDisplay = 'J';
      } else if (cardName === '12') {
        cardName = 'queen';
        cardDisplay = 'Q';
      } else if (cardName === '13') {
        cardName = 'king';
        cardDisplay = 'K';
      }

      if (currentSuit === 'hearts' || currentSuit === 'diamonds') {
        cardColor = 'red';
      } else if (currentSuit === 'spades' || currentSuit === 'clubs') {
        cardColor = 'black';
      }

      // Create a new card with the current name, suit, and rank
      const card = {
        name: cardName,
        suit: currentSuit,
        rank: rankCounter,
        suitSymbol: currentSymbol,
        displayName: cardDisplay,
        color: cardColor,
      };

      // Add the new card to the deck
      deck.push(card);
    }
  }

  // Return the completed card deck
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
  // create a new game. Insert a new row in the DB.
  const create = async (request, response) => {
    // cardContainer.innerHTML = '';
    let flashCards = []; 
    let flashCard;
    // deal out a new shuffled deck for this game.
    const cardDeck = shuffleCards(makeDeck());
    for (let i = 0; i < 10; i += 1) {
    // Pop player's card metadata from the deck
    flashCard = cardDeck.pop();
    flashCards.push(flashCard);
  }

    const gameInfo = {
      gameState: {
        flashCards,
      },
      createdBy: request.cookies.userId,
      isCompleted: false,
      isWon: false,
    };

    try {
      // run the DB INSERT query
      const newGame = await db.Game.create(gameInfo);

  
      // send the new game back to the user.
      // dont include the deck so the user can't cheat
      response.send({
        id: newGame.id,
        flashCards: newGame.gameState.flashCards,
      });
     
    } catch (error) {
      response.status(500).send(error);
      console.log('error :>> ', error);
    }
  };

  // deal two new cards from the deck.
  const result = async (request, response) => {
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
    result,
    create,
    refresh,
  };
}
