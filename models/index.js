const { Sequelize, DataTypes } = require('sequelize');
const dbConfig = require('../config/database').current;

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig);

const Admin = require('./Admin')(sequelize, DataTypes);
const Member = require('./Member')(sequelize, DataTypes);
const NotificationTemplate = require('./NotificationTemplate')(sequelize, DataTypes);
const NotificationLog = require('./NotificationLog')(sequelize, DataTypes);
const Subscription = require('./Subscription')(sequelize, DataTypes);
const OtpVerification = require('./OtpVerification')(sequelize, DataTypes);

Member.hasMany(NotificationLog, { foreignKey: 'member_id' });
NotificationLog.belongsTo(Member, { foreignKey: 'member_id' });

NotificationTemplate.hasMany(NotificationLog, { foreignKey: 'template_id' });
NotificationLog.belongsTo(NotificationTemplate, { foreignKey: 'template_id' });

Subscription.belongsTo(Member, { foreignKey: 'member_id' });
Member.hasOne(Subscription, { foreignKey: 'member_id' });

module.exports = {
  sequelize,
  Sequelize,
  Admin,
  Member,
  NotificationTemplate,
  NotificationLog,
  Subscription,
  OtpVerification
};
