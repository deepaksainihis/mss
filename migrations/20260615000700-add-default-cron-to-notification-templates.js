'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('notification_templates', 'is_default_cron', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      after: 'is_active'
    });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn('notification_templates', 'is_default_cron');
  }
};
