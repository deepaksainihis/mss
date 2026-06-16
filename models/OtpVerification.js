module.exports = (sequelize, DataTypes) => {
  return sequelize.define('OtpVerification', {
    mobile: { type: DataTypes.STRING(20), allowNull: false },
    otp_hash: { type: DataTypes.STRING, allowNull: false },
    purpose: { type: DataTypes.STRING, allowNull: false, defaultValue: 'subscription' },
    expires_at: { type: DataTypes.DATE, allowNull: false },
    verified_at: { type: DataTypes.DATE, allowNull: true },
    attempts: { type: DataTypes.INTEGER, defaultValue: 0 }
  }, {
    tableName: 'otp_verifications'
  });
};
