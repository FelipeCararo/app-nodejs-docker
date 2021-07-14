const express = require('express');
const Yup = require('yup');
const { Op } = require('sequelize');
const Citie = require('../models/Citie');

const routes = express.Router();

class CitieController {
  /**
   * Listagem das cidades
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
        state: Yup.string(),
        order: Yup.string().oneOf(['id']),
        sort: Yup.string().oneOf(['ASC', 'DESC']),
      })
      .validate(params);

    const {
      page = 1,
      limit: citie_limit = 10,
      order = 'id',
      sort = 'ASC',
      state,
      name,
    } = parsedParams;

    const limit = Math.min(citie_limit, 100);
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

    if (state) {
      where[Op.or] = {
        state: { [Op.like]: `%${state}%` },
      };
    }

    const cities = await Citie.findAndCountAll({
      where,
      limit,
      offset,
      order: Citie.sequelize.literal(`${order} ${sort}`),
    });

    const total_pages = Math.ceil(cities.count / limit);
    return res.json({
      items: cities.rows,
      total: cities.count,
      limit: parseInt(limit, 10),
      page: parseInt(page, 10),
      offset,
      total_pages,
      has_more: page < total_pages,
    });
  }

  /**
   * Busca uma cidade específica por ID
   * @param {Object} req
   * @param {Object} res
   */
  async find(req, res) {
    const { citieId: id } = req.params;
    const citie = await Citie.findByPk(id);

    if (!citie) {
      return res.status(404).json({ error: 'Cidade não encontrada' });
    }

    return res.json(citie);
  }

  /**
   * Realiza a criação do registro
   * @param {Object} req
   * @param {Object} res
   */
  async create(req, res) {
    const params = await Yup.object()
      .required()
      .shape({
        name: Yup.string().required(),
        state: Yup.string().required(),
      })
      .validate(req.body);

    const { name, state } = params;

    try {
      const citie = await Citie.create({
        name,
        state,
      });

      return res.status(201).json(citie);
    } catch (error) {
      return res.status(400).json('Ocorreu um erro ao incluir a cidade.');
    }
  }

  /**
   * Rotas das Cidades
   */
  routes() {
    routes.get('/', this.list);
    routes.post('/', this.create);
    routes.get('/:citieId', this.find);

    return routes;
  }
}

module.exports = new CitieController();
