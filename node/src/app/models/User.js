const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// eslint-disable-next-line import/no-extraneous-dependencies
const { Sequelize, Model } = require('sequelize');

class User extends Model {
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
        email: {
          type: Sequelize.STRING,
          field: 'email',
        },
        password: {
          type: Sequelize.STRING,
          field: 'password_hash',
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
        hooks: {
          beforeValidate: async (user) => {
            if (user.password) {
              // eslint-disable-next-line no-param-reassign
              user.password = await bcrypt.hash(user.password, 8);
            }
          },
        },
      },
    );

    return this;
  }
}

// eslint-disable-next-line func-names
User.prototype.checkPassword = function (password) {
  return bcrypt.compare(password, this.password);
};

// eslint-disable-next-line func-names
User.prototype.generateToken = function () {
  return jwt.sign({ id: this.id }, process.env.APP_SECRET);
};

module.exports = User;
