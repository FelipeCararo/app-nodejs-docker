const request = require('supertest');

const app = require('../../src/app');
const factory = require('../factories');
const User = require('../../src/app/models/User');

describe('Authentication', () => {
  beforeEach(async () => {
    await User.destroy({ truncate: true, force: true });
  });

  it('Deve autenticar com credenciais válidas', async () => {
    const user = await factory.create('User', {
      password: '123123',
    });

    const response = await request(app).post('/sessions').send({
      email: user.email,
      password: '123123',
    });

    expect(response.status).toBe(200);
  });

  it('Não deve autenticar com credenciais inválidas', async () => {
    const user = await factory.create('User', {
      password: '123123',
    });

    const response = await request(app).post('/sessions').send({
      email: user.email,
      password: '123456',
    });

    expect(response.status).toBe(401);
  });

  it('Deve retornar o token jwt quando autenticado', async () => {
    const user = await factory.create('User', {
      password: '123123',
    });

    const response = await request(app).post('/sessions').send({
      email: user.email,
      password: '123123',
    });

    expect(response.body).toHaveProperty('token');
  });

  it('Deve ser capaz de acessar rotas privadas quando autenticado', async () => {
    const user = await factory.create('User', {
      password: '123123',
    });

    const response = await request(app)
      .get('/dashboard')
      .set('Authorization', `Bearer ${user.generateToken()}`);

    expect(response.status).toBe(200);
  });

  it('Não deve ser capaz de acessar rotas privadas sem o token jwt', async () => {
    const response = await request(app).get('/dashboard');

    expect(response.status).toBe(401);
  });

  it('Não deve ser capaz de acessar rotas privadas com token jwt inválido', async () => {
    const response = await request(app)
      .get('/dashboard')
      .set('Authorization', `Bearer 123123`);

    expect(response.status).toBe(401);
  });
});
