const { Op } = require('sequelize');
const { Member, NotificationLog } = require('../models');

function todayRange() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

exports.index = async (req, res) => {
  const { start, end } = todayRange();
  const today = new Date().toISOString().slice(0, 10);
  const inSevenDays = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  const [
    totalMembers,
    activeMembers,
    upcomingReminders,
    sentToday,
    failedToday,
    recentNotifications,
    upcomingMembers
  ] = await Promise.all([
    Member.count(),
    Member.count({ where: { is_active: true } }),
    Member.count({ where: { is_active: true, next_reminder_date: { [Op.between]: [today, inSevenDays] } } }),
    NotificationLog.count({ where: { status: 'sent', sent_at: { [Op.between]: [start, end] } } }),
    NotificationLog.count({ where: { status: 'failed', sent_at: { [Op.between]: [start, end] } } }),
    NotificationLog.findAll({ include: [Member], order: [['created_at', 'DESC']], limit: 8 }),
    Member.findAll({
      where: { is_active: true, next_reminder_date: { [Op.gte]: today } },
      order: [['next_reminder_date', 'ASC']],
      limit: 8
    })
  ]);

  res.render('dashboard/index', {
    title: 'Dashboard',
    stats: { totalMembers, activeMembers, upcomingReminders, sentToday, failedToday },
    recentNotifications,
    upcomingMembers
  });
};
