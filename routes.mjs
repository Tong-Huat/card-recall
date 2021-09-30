import db from './models/index.mjs';
import { resolve } from 'path';
import initGamesController from './controllers/games.mjs';
import initUsersController from './controllers/users.mjs';

const checkLoggedIn = (request, response) => {
  const { loggedIn, userId } = request.cookies;
  let isLoggedIn = false;
  if (loggedIn){
    isLoggedIn = true;
    request.body.isLoggedIn = true;
  }
  response.send({ isLoggedIn });
};

export default function bindRoutes(app) {
  const GamesController = initGamesController(db);
  const UsersController = initUsersController(db);
  // main page
  app.get('/', (request, response) => {
    response.sendFile(resolve('dist', 'main.html'));
  });
  app.get('/isloggedin', checkLoggedIn);
  app.post('/register', UsersController.register);
  app.post('/login', UsersController.login);
  // create a new game
  app.post('/games', GamesController.create);

}
