const routes = require('express').Router();

const authMiddleware = require('./app/middleware/auth');

const SessionController = require('./app/controllers/SessionController');
const UserController = require('./app/controllers/UserController');
const CitieController = require('./app/controllers/CitieController');
const ClientController = require('./app/controllers/ClientController');

routes.use('/', SessionController.routes());

routes.use(authMiddleware);

routes.use('/user', UserController.routes());
routes.use('/client', ClientController.routes());
routes.use('/citie', CitieController.routes());

routes.get('/dashboard', (req, res) => res.status(200).send());

module.exports = routes;
