/* eslint-disable no-undef */
const request = require('supertest');

const app = require('../../src/app');

const factory = require('../factories');
const cliente = require('../payloads/client');
const cidade = require('../payloads/citie');

const User = require('../../src/app/models/User');
const Citie = require('../../src/app/models/Citie');
const Client = require('../../src/app/models/Client');

describe('Clients validation:', () => {
  beforeEach(async () => {
    await User.destroy({ truncate: true, force: true });
    await Client.destroy({ truncate: true, force: true });
    await Citie.destroy({ truncate: true, force: true });
  });

  it('Cadastrar clientes', async () => {
    const user = await factory.create('User', {
      password: '123123',
    });

    const citie = await Citie.create({
      name: cidade.name,
      state: cidade.state,
    });

    const response = await request(app)
      .post('/client')
      .send({
        name: cliente.name,
        sex: cliente.sex,
        birthdate: cliente.birthdate,
        age: cliente.age,
        cit_id: citie.id,
      })
      .set('Authorization', `Bearer ${user.generateToken()}`);

    expect(response.status).toBe(201);
  });

  it('Deve consultar todos os clientes', async () => {
    const user = await factory.create('User', {
      password: '123123',
    });

    const response = await request(app)
      .get('/client')
      .set('Authorization', `Bearer ${user.generateToken()}`);

    expect(response.status).toBe(200);
  });

  it('Deve consultar cliente pelo ID', async () => {
    const user = await factory.create('User', {
      password: '123123',
    });

    const citie = await Citie.create({
      name: cidade.name,
      state: cidade.state,
    });

    const client = await Client.create({
      name: cliente.name,
      sex: cliente.sex,
      birthdate: cliente.birthdate,
      age: cliente.age,
      cit_id: citie.id,
    });

    const response = await request(app)
      .get(`/client/${client.id}`)
      .set('Authorization', `Bearer ${user.generateToken()}`);

    expect(response.status).toBe(200);
  });

  it('Deve consultar cliente pelo nome', async () => {
    const user = await factory.create('User', {
      password: '123123',
    });

    const citie = await Citie.create({
      name: cidade.name,
      state: cidade.state,
    });

    const client = await Client.create({
      name: cliente.name,
      sex: cliente.sex,
      birthdate: cliente.birthdate,
      age: cliente.age,
      cit_id: citie.id,
    });

    const response = await request(app)
      .get(`/client?name=${client.name}`)
      .set('Authorization', `Bearer ${user.generateToken()}`);

    expect(response.status).toBe(200);
  });

  it('Deve alterar o nome do cliente', async () => {
    const user = await factory.create('User', {
      password: '123123',
    });

    const citie = await Citie.create({
      name: cidade.name,
      state: cidade.state,
    });

    const client = await Client.create({
      name: cliente.name,
      sex: cliente.sex,
      birthdate: cliente.birthdate,
      age: cliente.age,
      cit_id: citie.id,
    });

    const response = await request(app)
      .put(`/client/${client.id}`)
      .send({
        name: 'Joãozinho',
      })
      .set('Authorization', `Bearer ${user.generateToken()}`);

    expect(response.status).toBe(204);
  });

  it('Não deve alterar cliente que não existe', async () => {
    const user = await factory.create('User', {
      password: '123123',
    });

    const response = await request(app)
      .put('/client/999')
      .send({
        name: 'Joãozinho',
      })
      .set('Authorization', `Bearer ${user.generateToken()}`);

    expect(response.status).toBe(404);
  });

  it('Não deve remover cliente que não existe', async () => {
    const user = await factory.create('User', {
      password: '123123',
    });

    const response = await request(app)
      .delete('/client/999')
      .set('Authorization', `Bearer ${user.generateToken()}`);

    expect(response.status).toBe(404);
  });

  it('Deve remover cliente', async () => {
    const user = await factory.create('User', {
      password: '123123',
    });

    const citie = await Citie.create({
      name: cidade.name,
      state: cidade.state,
    });

    const client = await Client.create({
      name: cliente.name,
      sex: cliente.sex,
      birthdate: cliente.birthdate,
      age: cliente.age,
      cit_id: citie.id,
    });

    const response = await request(app)
      .delete(`/client/${client.id}`)
      .set('Authorization', `Bearer ${user.generateToken()}`);

    expect(response.status).toBe(204);
  });
});
