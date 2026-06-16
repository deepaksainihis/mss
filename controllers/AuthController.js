const bcrypt = require('bcrypt');
const { Admin } = require('../models');

exports.showLogin = (req, res) => {
  res.render('auth/login', { title: 'Admin Login' });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ where: { email } });

  if (!admin || !(await bcrypt.compare(password, admin.password))) {
    req.session.error = 'Invalid email or password.';
    return res.redirect('/login');
  }

  req.session.admin = { id: admin.id, name: admin.name, email: admin.email };
  return res.redirect('/dashboard');
};

exports.logout = (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
};
