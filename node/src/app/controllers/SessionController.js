const express = require('express');
const User = require('../models/User');

const routes = express.Router();

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    return res.json({
      user,
      token: user.generateToken(),
    });
  }

  /**
   * Aviso de conexão bem sucedida de exemplo
   * @param {Object} req
   * @param {Object} res
   */
  async connect(req, res) {
    return res.status(200).json({ msg: 'Api Conectada.' });
  }

  /**
   * Rotas do frete controller
   */
  routes() {
    routes.get('/', this.connect);
    routes.post('/sessions', this.store);

    return routes;
  }
}

module.exports = new SessionController();
