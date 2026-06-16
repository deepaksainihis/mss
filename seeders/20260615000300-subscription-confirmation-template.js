'use strict';

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    await queryInterface.bulkDelete('notification_templates', {
      name: 'Subscription Confirmation'
    }, {});
    await queryInterface.bulkInsert('notification_templates', [{
      name: 'Subscription Confirmation',
      type: 'subscription_confirmation',
      message: 'Namaste {{name}}, you have successfully subscribed to Gaushala donation reminders. We will notify you for your donation of Rs. {{donation_amount}} scheduled on {{next_reminder_date}}. Thank you for supporting Gau Seva.',
      is_active: true,
      is_default_cron: false,
      created_at: now,
      updated_at: now
    }], {});
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('notification_templates', { name: 'Subscription Confirmation' }, {});
  }
};
