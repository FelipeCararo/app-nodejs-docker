// eslint-disable-next-line import/no-extraneous-dependencies
const { Sequelize, Model } = require('sequelize');

class Citie extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          field: 'cit_id',
        },
        name: {
          type: Sequelize.STRING,
          field: 'name',
        },
        state: {
          type: Sequelize.STRING,
          field: 'state',
        },
        createdAt: {
          type: Sequelize.DATE,
          field: 'created_at',
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: 'updated_at',
        },
      },
      {
        sequelize,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
      },
    );

    return this;
  }
}

module.exports = Citie;
