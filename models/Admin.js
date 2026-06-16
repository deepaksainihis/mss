module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Admin', {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
    password: { type: DataTypes.STRING, allowNull: false }
  }, {
    tableName: 'admins'
  });
};
