'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const password = await bcrypt.hash('Admin@123', 10);
    await queryInterface.bulkDelete('admins', { email: 'admin@gaushala.com' }, {});
    await queryInterface.bulkInsert('admins', [{
      name: 'Gaushala Admin',
      email: 'admin@gaushala.com',
      password,
      created_at: now,
      updated_at: now
    }], {});
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('admins', { email: 'admin@gaushala.com' }, {});
  }
};
