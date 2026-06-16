'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('members', 'member_type', {
      type: Sequelize.ENUM('manual', 'subscribed'),
      allowNull: false,
      defaultValue: 'manual',
      after: 'donation_frequency'
    });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn('members', 'member_type');
  }
};
