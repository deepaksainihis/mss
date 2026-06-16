'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('members', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      name: { type: Sequelize.STRING, allowNull: false },
      mobile: { type: Sequelize.STRING(20), allowNull: false, unique: true },
      email: { type: Sequelize.STRING, allowNull: true },
      address: { type: Sequelize.TEXT, allowNull: true },
      donation_amount: { type: Sequelize.DECIMAL(10, 2), allowNull: true },
      donation_frequency: {
        type: Sequelize.ENUM('monthly', 'quarterly', 'half_yearly', 'yearly', 'custom'),
        allowNull: false,
        defaultValue: 'monthly'
      },
      member_type: {
        type: Sequelize.ENUM('manual', 'subscribed'),
        allowNull: false,
        defaultValue: 'manual'
      },
      next_reminder_date: { type: Sequelize.DATEONLY, allowNull: true },
      notes: { type: Sequelize.TEXT, allowNull: true },
      is_active: { type: Sequelize.BOOLEAN, defaultValue: true },
      whatsapp_subscribed: { type: Sequelize.BOOLEAN, defaultValue: true },
      created_at: { allowNull: false, type: Sequelize.DATE },
      updated_at: { allowNull: false, type: Sequelize.DATE }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('members');
  }
};
