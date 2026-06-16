require('dotenv').config();

const base = {
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || null,
  database: process.env.DB_NAME || 'gaushala_reminder_system',
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  dialect: 'mysql',
  logging: process.env.NODE_ENV === 'development' ? false : false,
  timezone: '+05:30',
  define: {
    underscored: true,
    timestamps: true
  }
};

module.exports = {
  development: base,
  test: { ...base, database: `${base.database}_test`, logging: false },
  production: { ...base, logging: false },
  current: base
};
