const faker = require('faker');
const { factory } = require('factory-girl');
const User = require('../src/app/models/User');
// const Citie = require('../src/app/models/Citie');
// const Cliente = require('../src/app/models/Cliente');

factory.define('User', User, {
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
});

// factory.define('Citie', Citie, {
//   name: faker.address.country(),
//   state: faker.address.state(),
// });

// factory.define('Cliente', Cliente, {
//   name: faker.name.findName(),
//   sex: 'male',
//   birthdate: '199-08-16',
//   age: 26,
//   cit_id: 1,
// });

module.exports = factory;
