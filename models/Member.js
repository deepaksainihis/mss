module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Member', {
    name: { type: DataTypes.STRING, allowNull: false },
    mobile: { type: DataTypes.STRING(20), allowNull: false, unique: true },
    email: { type: DataTypes.STRING, allowNull: true, validate: { isEmail: true } },
    address: { type: DataTypes.TEXT, allowNull: true },
    donation_amount: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    donation_frequency: {
      type: DataTypes.ENUM('monthly', 'quarterly', 'half_yearly', 'yearly', 'custom'),
      allowNull: false,
      defaultValue: 'monthly'
    },
    member_type: {
      type: DataTypes.ENUM('manual', 'subscribed'),
      allowNull: false,
      defaultValue: 'manual'
    },
    next_reminder_date: { type: DataTypes.DATEONLY, allowNull: true },
    reminder_days_before: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 3 },
    notes: { type: DataTypes.TEXT, allowNull: true },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
    whatsapp_subscribed: { type: DataTypes.BOOLEAN, defaultValue: true }
  }, {
    tableName: 'members'
  });
};
