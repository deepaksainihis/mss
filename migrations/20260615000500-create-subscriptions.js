'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('subscriptions', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      member_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'members', key: 'id' },
        onDelete: 'SET NULL'
      },
      name: { type: Sequelize.STRING, allowNull: true },
      mobile: { type: Sequelize.STRING(20), allowNull: false, unique: true },
      reminder_enabled: { type: Sequelize.BOOLEAN, defaultValue: true },
      festival_enabled: { type: Sequelize.BOOLEAN, defaultValue: true },
      general_enabled: { type: Sequelize.BOOLEAN, defaultValue: true },
      is_verified: { type: Sequelize.BOOLEAN, defaultValue: false },
      created_at: { allowNull: false, type: Sequelize.DATE },
      updated_at: { allowNull: false, type: Sequelize.DATE }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('subscriptions');
  }
};
