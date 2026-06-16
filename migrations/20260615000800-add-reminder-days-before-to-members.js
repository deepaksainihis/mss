'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('members', 'reminder_days_before', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 3,
      after: 'next_reminder_date'
    });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn('members', 'reminder_days_before');
  }
};
