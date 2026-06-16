module.exports = (sequelize, DataTypes) => {
  return sequelize.define('NotificationTemplate', {
    name: { type: DataTypes.STRING, allowNull: false },
    type: {
      type: DataTypes.ENUM('reminder', 'thank_you', 'general', 'festival', 'subscription_confirmation'),
      allowNull: false,
      defaultValue: 'general'
    },
    message: { type: DataTypes.TEXT, allowNull: false },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
    is_default_cron: { type: DataTypes.BOOLEAN, defaultValue: false }
  }, {
    tableName: 'notification_templates'
  });
};
