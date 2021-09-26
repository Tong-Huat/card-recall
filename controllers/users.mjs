import { getHash } from '../utility.mjs';

export default function initUsersController(db) {
  const home = async (request, response) => {
    response.render('games/index');
  };

  const login = async (request, response) => {
    const loginData = request.body;
    const hashedPassword = getHash(loginData.password);
    try {
      // locate user name within database
      const user = await db.User.findOne({
        where: {
          name: loginData.name,
        },
      });
      console.log('user==>', user);
      // convert keyed-in password to hashed so as to auth with the one in db

      console.log('hashed password', hashedPassword);
      console.log('user.password :>> ', user.password);
      if (hashedPassword === user.password) {
        response.cookie('loggedIn', true);
        response.cookie('userId', user.id);
        response.send({ user });
      } else {
        throw new Error('Please login to proceed');
      }
    }
    catch (error) {
      response.send({ error: error.message });
    }
  };

  const register = async (request, response) => {
    const user = request.body;
    try {
      const existingUser = await db.User.findOne({
        where: {
          name: user.name,
        },
      });
      if (!existingUser) {
        const hashedPassword = getHash(user.password);
        await db.User.create({
          name: user.name,
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        response.send('userCreated');
      } else {
        throw new Error('Failed Registration');
      }
    } catch (error) {
      response.send({ error: error.message });
    }
  };
  return {
    home, login, register,
  };
}
