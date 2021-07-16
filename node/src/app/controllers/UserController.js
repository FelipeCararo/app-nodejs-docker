const express = require('express');
const Yup = require('yup');
// eslint-disable-next-line import/no-extraneous-dependencies
const { Op } = require('sequelize');
const User = require('../models/User');

const routes = express.Router();

class UserController {
  constructor() {
    this.User = User;
  }

  /**
   * Listagem dos usuários
   * @param {Object} req
   * @param {Object} res
   */
  async list(req, res) {
    const params = {
      ...req.query,
    };

    const parsedParams = await Yup.object()
      .required()
      .shape({
        id: Yup.number(),
        name: Yup.string(),
        email: Yup.string(),
        order: Yup.string().oneOf(['id']),
        sort: Yup.string().oneOf(['ASC', 'DESC']),
      })
      .validate(params);

    const {
      page = 1,
      limit: user_limit = 10,
      order = 'id',
      sort = 'ASC',
      email,
      name,
    } = parsedParams;

    const limit = Math.min(user_limit, 100);
    const offset = (page - 1) * limit;
    const where = {};
    const filters = ['id'];

    /**
     * Tratamento de filtros padrão
     */
    filters.forEach((filter) => {
      if (parsedParams[filter]) {
        where[filter] = parsedParams[filter];
      }
    });

    if (name) {
      where[Op.or] = {
        name: { [Op.iLike]: `%${name}%` },
      };
    }

    if (email) {
      where[Op.or] = {
        email: { [Op.iLike]: `%${email}%` },
      };
    }

    const users = await this.User.findAndCountAll({
      where,
      limit,
      offset,
      order: User.sequelize.literal(`${order} ${sort}`),
    });

    const totalPages = Math.ceil(users.count / limit);

    return res.status(200).json({
      items: users.rows,
      total: users.count,
      limit: parseInt(limit, 10),
      page: parseInt(page, 10),
      offset,
      total_pages: totalPages,
      has_more: page < totalPages,
    });
  }

  /**
   * Busca um usuário especifico
   * @param {Object} req
   * @param {Object} res
   */
  async find(req, res) {
    const { userId: id } = req.params;
    const user = await this.User.findByPk(id);

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    return res.json(user);
  }

  /**
   * Realiza a criação do user
   * @param {Object} req
   * @param {Object} res
   */
  async create(req, res) {
    const params = await Yup.object()
      .required()
      .shape({
        name: Yup.string().required(),
        email: Yup.string().required(),
        password: Yup.string().required(),
      })
      .validate(req.body);

    const { name, email, password } = params;

    try {
      const user = await this.User.create({
        name,
        email,
        password,
      });

      return res.status(201).json(user);
    } catch (error) {
      return res.status(400).json('Ocorreu um erro ao incluir o User.');
    }
  }

  /**
   * Realiza a exclusão do usuário
   * @param {Object} req
   * @param {Object} res
   */
  async delete(req, res) {
    const { userId } = req.params;
    const user = await this.User.findByPk(userId);

    if (user) {
      await user.destroy();
      return res.status(204).json();
    }
    return res.status(404).json({ error: 'User não encontrado' });
  }

  /**
   * Rotas dos Usuários
   */
  routes() {
    routes.get('/', this.list);
    routes.post('/', this.create);
    routes.get('/:userId', this.find);
    routes.delete('/:userId', this.delete);

    return routes;
  }
}

module.exports = new UserController();
