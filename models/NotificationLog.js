module.exports = (sequelize, DataTypes) => {
  return sequelize.define('NotificationLog', {
    member_id: { type: DataTypes.INTEGER, allowNull: true },
    template_id: { type: DataTypes.INTEGER, allowNull: true },
    mobile: { type: DataTypes.STRING(20), allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: false },
    status: {
      type: DataTypes.ENUM('sent', 'failed', 'queued'),
      allowNull: false,
      defaultValue: 'queued'
    },
    response: { type: DataTypes.TEXT, allowNull: true },
    sent_at: { type: DataTypes.DATE, allowNull: true }
  }, {
    tableName: 'notification_logs'
  });
};
