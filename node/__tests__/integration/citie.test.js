/* eslint-disable no-undef */
const request = require('supertest');

const app = require('../../src/app');

const factory = require('../factories');
const cidade = require('../payloads/citie');
const User = require('../../src/app/models/User');
const Citie = require('../../src/app/models/Citie');

describe('Cities validation:', () => {
  beforeEach(async () => {
    await User.destroy({ truncate: true, force: true });
    await Citie.destroy({ truncate: true, force: true });
  });

  it('Deve cadastrar cidade', async () => {
    const user = await factory.create('User', {
      password: '123123',
    });

    const response = await request(app)
      .post('/citie')
      .send({
        name: cidade.name,
        state: cidade.state,
      })
      .set('Authorization', `Bearer ${user.generateToken()}`);

    expect(response.status).toBe(201);
  });

  it('Deve consultar cidade pelo nome', async () => {
    const user = await factory.create('User', {
      password: '123123',
    });

    const response = await request(app)
      .get(`/citie?name=${cidade.name}`)
      .set('Authorization', `Bearer ${user.generateToken()}`);

    expect(response.status).toBe(200);
  });

  it('Deve consultar cidade pelo estado', async () => {
    const user = await factory.create('User', {
      password: '123123',
    });

    const response = await request(app)
      .get(`/citie?state=${cidade.state}`)
      .set('Authorization', `Bearer ${user.generateToken()}`);

    expect(response.status).toBe(200);
  });
});
