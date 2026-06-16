module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Subscription', {
    member_id: { type: DataTypes.INTEGER, allowNull: true },
    name: { type: DataTypes.STRING, allowNull: true },
    mobile: { type: DataTypes.STRING(20), allowNull: false, unique: true },
    reminder_enabled: { type: DataTypes.BOOLEAN, defaultValue: true },
    festival_enabled: { type: DataTypes.BOOLEAN, defaultValue: true },
    general_enabled: { type: DataTypes.BOOLEAN, defaultValue: true },
    is_verified: { type: DataTypes.BOOLEAN, defaultValue: false }
  }, {
    tableName: 'subscriptions'
  });
};
