const express = require('express');
const Yup = require('yup');
const { Op } = require('sequelize');
const Client = require('../models/Client');

const routes = express.Router();

class ClientController {
  /**
   * Listagem dos clientes
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
        order: Yup.string().oneOf(['id']),
        sort: Yup.string().oneOf(['ASC', 'DESC']),
      })
      .validate(params);

    const {
      page = 1,
      limit: client_limit = 10,
      order = 'id',
      sort = 'ASC',
      name,
    } = parsedParams;

    const limit = Math.min(client_limit, 100);
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
        name: { [Op.like]: `%${name}%` },
      };
    }

    const clients = await Client.findAndCountAll({
      where,
      limit,
      offset,
      order: Client.sequelize.literal(`${order} ${sort}`),
    });

    const total_pages = Math.ceil(clients.count / limit);
    return res.json({
      items: clients.rows,
      total: clients.count,
      limit: parseInt(limit, 10),
      page: parseInt(page, 10),
      offset,
      total_pages,
      has_more: page < total_pages,
    });
  }

  /**
   * Busca um cliente especifico
   * @param {Object} req
   * @param {Object} res
   */
  async find(req, res) {
    const { clientId: id } = req.params;
    const client = await Client.findByPk(id);

    if (!client) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    return res.json(client);
  }

  /**
   * Realiza a criação do cliente
   * @param {Object} req
   * @param {Object} res
   */
  async create(req, res) {
    const params = await Yup.object()
      .required()
      .shape({
        name: Yup.string().required(),
        sex: Yup.string().required(),
        birthdate: Yup.string().required(),
        age: Yup.number().required(),
        cit_id: Yup.number(),
      })
      .validate(req.body);

    const { name, sex, birthdate, age, cit_id } = params;

    const client = await Client.create({
      name,
      sex,
      birthdate,
      age,
      cit_id,
    });

    if (!client) {
      return res.status(400).json('Ocorreu um erro ao incluir o Cliente.');
    }

    return res.status(201).json(client);
  }

  /**
   * Realiza a atualização do cliente
   * @param {Object} req
   * @param {Object} res
   */
  async update(req, res) {
    const { clientId } = req.params;
    const client = await Client.findByPk(clientId);

    if (!client) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    const schema = Yup.object().required().shape({
      name: Yup.string(),
      sex: Yup.string(),
      birthdate: Yup.string(),
      age: Yup.number(),
      cit_id: Yup.number(),
    });

    try {
      await schema.validate(req.body);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }

    const { ...update } = req.body;

    try {
      await client.update(update, {
        fields: Object.keys(update),
      });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(204).json();
  }

  /**
   * Realiza a exclusão do cliente
   * @param {Object} req
   * @param {Object} res
   */
  async delete(req, res) {
    const { clientId } = req.params;
    const client = await Client.findByPk(clientId);

    if (client) {
      await client.destroy();
      return res.status(204).json();
    }
    return res.status(404).json({ error: 'Cliente não encontrado' });
  }

  /**
   * Rotas dos Clientes
   */
  routes() {
    routes.get('/', this.list);
    routes.get('/:clientId', this.find);
    routes.post('/', this.create);
    routes.put('/:clientId', this.update);
    routes.delete('/:clientId', this.delete);

    return routes;
  }
}

module.exports = new ClientController();
