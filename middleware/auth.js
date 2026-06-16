module.exports = (req, res, next) => {
  if (req.session && req.session.admin) {
    res.locals.admin = req.session.admin;
    return next();
  }
  req.flashError = 'Please login to continue.';
  return res.redirect('/login');
};
