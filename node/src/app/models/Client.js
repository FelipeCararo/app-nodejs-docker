const { Sequelize, Model } = require('sequelize');

class Client extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          field: 'id',
        },
        name: {
          type: Sequelize.STRING,
          field: 'name',
        },
        sex: {
          type: Sequelize.STRING,
          field: 'sex',
        },
        birthdate: {
          type: Sequelize.STRING,
          field: 'birthdate',
        },
        age: {
          type: Sequelize.INTEGER,
          field: 'age',
        },
        cit_id: {
          type: Sequelize.INTEGER,
          field: 'cit_id',
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
      },
      {
        sequelize,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Citie, {
      foreignKey: 'cit_id',
      as: 'cities',
      onDelete: 'CASCADE',
    });
  }
}

module.exports = Client;
