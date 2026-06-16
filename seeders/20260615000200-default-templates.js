'use strict';

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    await queryInterface.bulkDelete('notification_templates', {
      name: ['Donation Reminder', 'Thank You Message', 'Subscription Confirmation']
    }, {});
    await queryInterface.bulkInsert('notification_templates', [
      {
        name: 'Donation Reminder',
        type: 'reminder',
        message: 'Namaste {{name}}, this is a gentle reminder for your Gaushala donation of Rs. {{donation_amount}}. Thank you for supporting Gau Seva.',
        is_active: true,
        is_default_cron: true,
        created_at: now,
        updated_at: now
      },
      {
        name: 'Thank You Message',
        type: 'thank_you',
        message: 'Namaste {{name}}, thank you for your kind support to our Gaushala. Your seva is deeply appreciated.',
        is_active: true,
        is_default_cron: false,
        created_at: now,
        updated_at: now
      },
      {
        name: 'Subscription Confirmation',
        type: 'subscription_confirmation',
        message: 'Namaste {{name}}, you have successfully subscribed to Gaushala donation reminders. We will notify you for your donation of Rs. {{donation_amount}} scheduled on {{next_reminder_date}}. Thank you for supporting Gau Seva.',
        is_active: true,
        is_default_cron: false,
        created_at: now,
        updated_at: now
      }
    ], {});
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('notification_templates', null, {});
  }
};
