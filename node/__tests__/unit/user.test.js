require('../../src/database/');
const bcrypt = require('bcryptjs');

const User = require('../../src/app/models/User');
const Citie = require('../../src/app/models/Citie');

describe('User tests', () => {
  beforeEach(async () => {
    await User.destroy({ truncate: true, force: true });
  });

  it('should encrypt user password', async () => {
    const usercreate = await User.create({
      name: 'Felipe',
      email: 'felipe@gmail.com',
      password: '123456',
    });
    const teste = await Citie.findByPk(1);

    const compareHash = await bcrypt.compare('123456', usercreate.password);

    expect(compareHash).toBe(true);
  });
});
