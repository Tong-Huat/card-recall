import './styles.scss';
import axios from 'axios';
// global value that holds info about the current hand.
let currentGame = null;
let displayedCards = []
let selectedCards = []
// query for game and card container
const gameContainer = document.querySelector('#game-container');
const cardSelectionContainer = document.querySelector('#select-container');
const errorContainer = document.querySelector('#error-container');
// create registrations on landing page
const registrationContainer = document.createElement('div');
registrationContainer.classList.add('container', 'form-signin', 'bg-light');

// create registration elements: user name and pw
const registrationText = document.createElement('h2');
registrationText.innerText = 'Registration Form';

const regUserNameDiv = document.createElement('div');
regUserNameDiv.classList.add('form-floating');
const regUserName = document.createElement('input');
regUserName.placeholder = 'Input Username';

const regPasswordDiv = document.createElement('div');
regPasswordDiv.classList.add('form-floating');
const regPassword = document.createElement('input');
regPassword.placeholder = 'Input Password';

const registrationBtn = document.createElement('button');
registrationBtn.innerText = 'Register';

regUserNameDiv.appendChild(regUserName);
regPasswordDiv.appendChild(regPassword);
registrationContainer.appendChild(registrationText);
registrationContainer.appendChild(regUserNameDiv);
registrationContainer.appendChild(regPasswordDiv);
registrationContainer.appendChild(registrationBtn);

// ************** create login on landing page **************//
const loginContainer = document.createElement('div');
loginContainer.classList.add('container', 'form-signin', 'bg-light');

// create login elements: UserName and pw
const loginText = document.createElement('h2');
loginText.innerText = 'Login Form';

const userNameDiv = document.createElement('div');
userNameDiv.classList.add('form-floating');
const userName = document.createElement('input');
userName.placeholder = 'Input User Name';

const passwordDiv = document.createElement('div');
passwordDiv.classList.add('form-floating');
const password = document.createElement('input');
password.placeholder = 'Input Password';

const loginBtn = document.createElement('button');
loginBtn.innerText = 'Login';

userNameDiv.appendChild(userName);
passwordDiv.appendChild(password);
loginContainer.appendChild(loginText);
loginContainer.appendChild(userNameDiv);
loginContainer.appendChild(passwordDiv);
loginContainer.appendChild(loginBtn);

const checkLoggedIn = () => {
  axios.get('/isloggedin')
    .then((response) => {
      console.log('response from login :>> ', response);
      if (response.data.isLoggedIn === true)
      {
        document.body.appendChild(diffContainer);
        document.body.appendChild(playBtn);
      }
      else {
        // render other buttons
        document.body.appendChild(registrationContainer);
        document.body.appendChild(loginContainer);
      }
    })
    .catch((error) => console.log('error from logging in', error));
};

// ************** create difficulty selection elements **************//
const diffContainer = document.createElement('div');
diffContainer.classList.add('container', 'bg-light', 'cardContainer');

const bgnBtn = document.createElement('input');
bgnBtn.type = 'radio';
bgnBtn.name = 'difficulty';
bgnBtn.checked = false;
bgnBtn.value = 'beginner';
const bgnLabel = document.createElement('label');
const bgnDescription = document.createTextNode('Beginner');
bgnLabel.appendChild(bgnDescription);

const advBtn = document.createElement('input');
advBtn.type = 'radio';
advBtn.name = 'difficulty';
advBtn.checked = false;
advBtn.value = 'advanced';
const advLabel = document.createElement('label');
const advDescription = document.createTextNode('Advanced');
advLabel.appendChild(advDescription);

const expBtn = document.createElement('input');
expBtn.type = 'radio';
expBtn.name = 'difficulty';
expBtn.checked = false;
expBtn.value = 'expert';
const expLabel = document.createElement('label');
const expDescription = document.createTextNode('Expert');
expLabel.appendChild(expDescription);

diffContainer.appendChild(bgnBtn)
diffContainer.appendChild(bgnLabel)
diffContainer.appendChild(advBtn)
diffContainer.appendChild(advLabel)
diffContainer.appendChild(expBtn)
diffContainer.appendChild(expLabel)

// create play game btn to start 1st game
const playBtn = document.createElement('button');
playBtn.innerText = 'Play Game';


// ************** create card and card holders **************//
const flashedCards = document.createElement('div');
flashedCards.classList.add('flashedCard')
const flashedCardContainer = document.createElement('div');
flashedCardContainer.classList.add('container', 'bg-light', 'cardContainer');
flashedCardContainer.appendChild(flashedCards)

const allCards = document.createElement('div');
const allCardsContainer = document.createElement('div');
allCardsContainer.classList.add('container', 'bg-light', 'cardContainer');
allCardsContainer.innerText = "Select the card order"

// create submit ans button
const submitAnsBtn = document.createElement('button');
submitAnsBtn.innerText = 'Submit';

const resultOutcome = document.createElement('h3');

// create play again btn
const playAgainBtn = document.createElement('button');
playAgainBtn.innerText = 'Play Again';



// create card function
const createCard = (cardInfo) => {
  const suit = document.createElement('div');
  suit.classList.add('suit');
  suit.innerText = cardInfo.suitSymbol;

  const name = document.createElement('div');
  name.classList.add('name', cardInfo.color);
  name.innerText = cardInfo.displayName;

  const card = document.createElement('div');
  card.classList.add('card');
 
  card.appendChild(name);
  card.appendChild(suit);

  return card;
};

// create num of cards to be flashed according to difficulty level 
const flashingCards = ({ flashCards, }, gameLevel) => {
  let cardElement;
  let numOfCards;
  // manipulate DOM
  if (gameLevel == 'beginner'){
    numOfCards = 5
  } else if (gameLevel == 'advanced'){
    numOfCards = 7
  } else {
    numOfCards = 10
  }
 
  
  for (let i = 0; i < numOfCards; i += 1){
    displayedCards.push(flashCards[i])
    cardElement = createCard(flashCards[i]);
    cardElement.id = `card${i}`;
    flashedCards.appendChild(cardElement);
  console.log('flashCards :>> ', flashCards);
  console.log('displayedCards :>> ', displayedCards);
  
  setTimeout(() => {
    gameContainer.innerText = '';
    }, 5000);
    
  console.log('flashCards :>> ', flashCards);
  flashedCardContainer.appendChild(flashedCards);
  gameContainer.appendChild(flashedCardContainer);
};
}

// display all cards in array for user to select order
const displayCards = ({ flashCards,}) =>
{
  let cardElement;
    // shuffle the mixed flash card array
  for (let i = flashCards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [flashCards[i], flashCards[j]] = [flashCards[j], flashCards[i]];
    }
    
  // append all 10 cards for selection
  for (let i = 0; i < flashCards.length; i += 1){
    cardElement = createCard(flashCards[i]);
    cardElement.id = `card${i}`;
    allCards.appendChild(cardElement);
  }
  allCardsContainer.appendChild(allCards)
  cardSelectionContainer.appendChild(allCardsContainer);
}

// event listener for all displayed cards slated for selection
const cardSelection = () => {
const card0 = document.getElementById('card0');
card0.addEventListener('click', cardSelected);
const card1 = document.getElementById('card1');
card1.addEventListener('click', cardSelected)
const card2 = document.getElementById('card2');
card2.addEventListener('click', cardSelected)
const card3 = document.getElementById('card3');
card3.addEventListener('click', cardSelected)
const card4 = document.getElementById('card4');
card4.addEventListener('click', cardSelected)
const card5 = document.getElementById('card5');
card5.addEventListener('click', cardSelected)
const card6 = document.getElementById('card6');
card6.addEventListener('click', cardSelected)
const card7 = document.getElementById('card7');
card7.addEventListener('click', cardSelected)
const card8 = document.getElementById('card8');
card8.addEventListener('click', cardSelected)
const card9 = document.getElementById('card9');
card9.addEventListener('click', cardSelected)
}

// selected cards to be appended to solution array and disappear
const cardSelected = (e) => {
   if (e.target.nodeName === "DIV"){
    document.getElementById(e.target.id).remove()
    // ansContainer.appendChild(e.target)
    // document.body.appendChild(ansContainer)
    const displayName = e.target.firstChild.innerText;
    const cardSuitSymbol = e.target.lastChild.innerText;
    console.log(e.target.firstChild.innerText)
    console.log(e.target.lastChild.innerText)
    selectedCards.push({displayName, suitSymbol: cardSuitSymbol })
    console.log('selectedCards :>> ', selectedCards);
  }
}

const displayFinalResults = () => {
  let cardElement;
  
  for (let i = 0; i < selectedCards.length; i += 1){
    cardElement = createCard(selectedCards[i]);
    allCards.appendChild(cardElement);
  }
  for (let i = 0; i < displayedCards.length; i += 1){
    cardElement = createCard(displayedCards[i]);
    flashedCards.appendChild(cardElement);
  }
  flashedCardContainer.innerText = "Actual Card Order"
  flashedCardContainer.appendChild(flashedCards)
  gameContainer.appendChild(flashedCardContainer);
  allCardsContainer.innerText = "Your Selected Order"
  allCardsContainer.appendChild(allCards)
  cardSelectionContainer.appendChild(allCardsContainer);
}

registrationBtn.addEventListener('click', () => {
  const registerData = {
    name: regUserName.value,
    password: regPassword.value,
  };
  
  console.log(registerData);
  axios
    .post('/register', registerData)
    .then((response) => {
      console.log('hellloow>>>>>>', response.data);
      if (response.data.error){
        throw response.data.error;
      } else {
        document.body.removeChild(registrationContainer);
        registrationContainer.innerHTML = '';
      }
    })
    .catch((error) => {
      errorContainer.innerHTML = '<p style="color:red">Invalid Registration Details</p>';
      console.log(error);
    })
     checkLoggedIn();
});

loginBtn.addEventListener('click', () => {
  const loginData = {
    name: userName.value,
    password: password.value,
  };
  console.log(loginData);
  axios
    .post('/login', loginData)
    .then((response) => {
      console.log('hellloow>>>>>>', response.data);
      if (response.data.error)
      {
         throw response.data.error;
      } else {
        document.body.appendChild(diffContainer);
        document.body.appendChild(playBtn);
        loginContainer.innerHTML = '';
        document.body.removeChild(loginContainer);
        document.body.removeChild(registrationContainer);
        document.body.removeChild(errorContainer);
      }
    })
      .catch((error) => {
      errorContainer.innerHTML = '<p style="color:red">Invalid Login Details</p>';
      console.log(error);
    })
     checkLoggedIn();
});

playBtn.addEventListener('click', () => {
  document.body.removeChild(playBtn);
  gameContainer.appendChild(flashedCardContainer);
  // Make a request to create a new game
  axios
   .post('/games')
   .then( (response) => {
    // set the global value to the new game.
      currentGame = response.data;
      console.log('currentGame>>>>>>>',currentGame);
      const difficulty = document.querySelector('input[name="difficulty"]:checked');
      const gameLevel = difficulty.value
      document.body.removeChild(diffContainer);
      // display it out to the user
      flashingCards(currentGame, gameLevel);
      setTimeout(() => {
      displayCards(currentGame);
      cardSelection();
      document.body.appendChild(submitAnsBtn);
    }, 3000);
     
    })
    .catch((error) => {
      // handle error
      console.log(error);
    });
});

submitAnsBtn.addEventListener('click', () => {
  let cardDifference = displayedCards.length - selectedCards.length;
  if(displayedCards.length > selectedCards.length){ 
    errorContainer.innerHTML = `<p style="color:red">Number of selected cards is lesser that those displayed. Pls select ${cardDifference} more cards! </p>`;
    setTimeout(() => { errorContainer.innerHTML = ""}, 3000)
  } else {
  allCards.innerHTML = ""
  flashedCards.innerHTML = ""
  cardSelectionContainer.removeChild(allCardsContainer);
  let playerWon = false;
  let count = 0;
  
  // check for win conditions
  for(let i = 0; i < displayedCards.length; i += 1){
  if(displayedCards[i].displayName === selectedCards[i].displayName && 
      displayedCards[i].suitSymbol === selectedCards[i].suitSymbol){
        count += 1;       
      }
  }
  if(count === displayedCards.length){
      playerWon = true
      resultOutcome.innerText = 'You won'
      console.log('you won')
      document.body.removeChild(submitAnsBtn);
      } else {
      resultOutcome.innerText = 'You lost'
      console.log('you lost ');
      document.body.removeChild(submitAnsBtn);
      }
    displayFinalResults();
    document.body.appendChild(resultOutcome)
    document.body.appendChild(playAgainBtn)
  }
  });


playAgainBtn.addEventListener('click', () =>{
  flashedCardContainer.innerText = ""
  allCardsContainer.innerText = "Select the card order"
  allCards.innerHTML = ""
  flashedCards.innerHTML = ""
  cardSelectionContainer.removeChild(allCardsContainer);
  gameContainer.removeChild(flashedCardContainer);
  document.body.removeChild(resultOutcome)
  document.body.removeChild(playAgainBtn)
  currentGame = null;
  displayedCards = []
  selectedCards = []
  document.body.appendChild(diffContainer);
  document.body.appendChild(playBtn);
});

checkLoggedIn()