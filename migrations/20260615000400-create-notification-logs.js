'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('notification_logs', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      member_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'members', key: 'id' },
        onDelete: 'SET NULL'
      },
      template_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'notification_templates', key: 'id' },
        onDelete: 'SET NULL'
      },
      mobile: { type: Sequelize.STRING(20), allowNull: false },
      message: { type: Sequelize.TEXT, allowNull: false },
      status: { type: Sequelize.ENUM('sent', 'failed', 'queued'), allowNull: false, defaultValue: 'queued' },
      response: { type: Sequelize.TEXT, allowNull: true },
      sent_at: { type: Sequelize.DATE, allowNull: true },
      created_at: { allowNull: false, type: Sequelize.DATE },
      updated_at: { allowNull: false, type: Sequelize.DATE }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('notification_logs');
  }
};
