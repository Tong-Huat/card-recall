import db from './models/index.mjs';
import { resolve } from 'path';
import initGamesController from './controllers/games.mjs';
import initUsersController from './controllers/users.mjs';

export default function bindRoutes(app) {
  const GamesController = initGamesController(db);
  const UsersController = initUsersController(db);
  // main page
  app.get('/home', (request, response) => {
    response.sendFile(resolve('dist', 'main.html'));
  });
  app.post('/register', UsersController.register);
  app.post('/login', UsersController.login);
  // create a new game
  app.post('/games', GamesController.create);

}
