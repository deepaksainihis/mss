'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('otp_verifications', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      mobile: { type: Sequelize.STRING(20), allowNull: false },
      otp_hash: { type: Sequelize.STRING, allowNull: false },
      purpose: { type: Sequelize.STRING, allowNull: false, defaultValue: 'subscription' },
      expires_at: { type: Sequelize.DATE, allowNull: false },
      verified_at: { type: Sequelize.DATE, allowNull: true },
      attempts: { type: Sequelize.INTEGER, defaultValue: 0 },
      created_at: { allowNull: false, type: Sequelize.DATE },
      updated_at: { allowNull: false, type: Sequelize.DATE }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('otp_verifications');
  }
};
