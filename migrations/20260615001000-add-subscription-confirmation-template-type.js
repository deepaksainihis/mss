'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('notification_templates', 'type', {
      type: Sequelize.ENUM('reminder', 'thank_you', 'general', 'festival', 'subscription_confirmation'),
      allowNull: false,
      defaultValue: 'general'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('notification_templates', 'type', {
      type: Sequelize.ENUM('reminder', 'thank_you', 'general', 'festival'),
      allowNull: false,
      defaultValue: 'general'
    });
  }
};
