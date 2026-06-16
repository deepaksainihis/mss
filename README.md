# Gaushala Reminder System

A Node.js, Express, EJS, MySQL, Sequelize and Bootstrap 5 application for managing Gaushala donors, offline donation reminders, WhatsApp notifications, public OTP subscription preferences, and notification history.

This is not a payment system. Donations are collected offline.

## Features

- Admin login/logout with session authentication
- bcrypt password hashing
- Member and donor management
- Dashboard metrics for members, reminders, sent notifications, and failures
- Notification templates with placeholders
- Bulk WhatsApp notification sending
- Scheduled reminder job using node-cron
- Per-member notification lead time before donation date, defaulting to 3 days
- Public WhatsApp subscription with OTP verification
- Public subscribers are automatically added as members with type `subscribed`
- Notification history logs
- Sequelize migrations and seeders

## Setup

1. Install Node.js LTS and make sure MySQL is running.
2. Create a MySQL database:

```sql
CREATE DATABASE gaushala_reminder_system;
```

3. Install dependencies:

```bash
npm install
```

4. Copy environment settings:

```bash
copy .env.example .env
```

5. Update `.env` with your database and WhatsApp API settings.

6. Run migrations and seeders:

```bash
npm run db:migrate
npm run db:seed
```

7. Start the app:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Default Admin

- Email: `admin@gaushala.com`
- Password: `Admin@123`

## WhatsApp

Set `WHATSAPP_ENABLED=false` for local development. In this mode, messages are logged as simulated successful sends.

For production, set `WHATSAPP_ENABLED=true` and configure:

- `WHATSAPP_API_URL`
- `WHATSAPP_TOKEN`
- `WHATSAPP_FROM_NUMBER`

## Template Placeholders

Templates support member placeholders such as:

- `{{name}}`
- `{{mobile}}`
- `{{donation_amount}}`
- `{{donation_frequency}}`
- `{{next_reminder_date}}`

## Reminder Job

The cron expression is controlled by `REMINDER_CRON`. The default is:

```text
0 9 * * *
```

That runs daily at 9:00 AM Asia/Kolkata time.

Each member can have a notification lead time such as 1, 2, 3, or more days before the next donation date. If no value is configured, the system uses 3 days before the donation date.

## Member Types

Members added from the admin panel use type `manual`. People who complete the public subscription flow are created as members with type `subscribed`, so they are included in bulk WhatsApp notifications when active and subscribed. During subscription, they can also provide donation amount, donation frequency, and donation date for reminder scheduling.
