import './styles.scss';
import axios from 'axios';


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
document.body.appendChild(registrationContainer);

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
document.body.appendChild(loginContainer);

// global value that holds info about the current hand.
let currentGame = null;
// create game btn
const createGameBtn = document.createElement('button');

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
      if (!response.data.error)
      {
        document.body.removeChild(registrationContainer);
        registrationContainer.innerHTML = '';
      }
    });
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
      if (!response.data.error)
      {
        document.body.appendChild(createGameBtn);
        loginContainer.innerHTML = '';
        document.body.removeChild(loginContainer);
        document.body.removeChild(registrationContainer);
      }
    });
});
// ************** create card  elements **************//
const flashedCards = document.createElement('h5');

const cardContainer = document.createElement('div');
cardContainer.classList.add('container', 'form-signin', 'bg-light', 'cardContainer');

cardContainer.appendChild(flashedCards)
// create card function
const createCard = (cardInfo) => {
  const suit = document.createElement('div');
  suit.classList.add('suit');
  suit.innerText = cardInfo.suitSymbol;

  const name = document.createElement('div');
  name.classList.add('name', cardInfo.color);
  name.innerText = cardInfo.displayName;

  const card = document.createElement('div');
  card.classList.add('card', 'highlight');
 
  card.appendChild(name);
  card.appendChild(suit);

  return card;
};

const runGame = function ({ flashCards,
}) {
  let cardElement;
  // manipulate DOM
  const gameContainer = document.querySelector('#game-container');
  for (let i = 0; i < flashCards.length; i += 1){
    cardElement = createCard(flashCards[i]);
    cardElement.id = `card${i}`;
    flashedCards.appendChild(cardElement)
  }
    
 
  console.log('flashCards :>> ', flashCards);
  gameContainer.appendChild(cardContainer);
};

const createGame = function () {
  document.body.removeChild(createGameBtn);
  // Make a request to create a new game
  axios
    .post('/games')
    .then((response) => {
    // set the global value to the new game.
      currentGame = response.data;
      console.log(currentGame);
      // display it out to the user
      runGame(currentGame);
    })
    .catch((error) => {
      // handle error
      console.log(error);
    });
};

// manipulate DOM, set up create game button
createGameBtn.addEventListener('click', createGame);
createGameBtn.innerText = 'Create Game';
// document.body.appendChild(createGameBtn);
