require('dotenv').config();

const path = require('path');
const express = require('express');
const session = require('express-session');
const SequelizeStoreFactory = require('connect-session-sequelize');
const { sequelize } = require('./models');
const { scheduleReminderJob } = require('./jobs/ReminderJob');

const app = express();
const SequelizeStore = SequelizeStoreFactory(session.Store);
const sessionStore = new SequelizeStore({ db: sequelize });

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'change-this-secret',
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 8
  }
}));

app.use((req, res, next) => {
  res.locals.appName = process.env.APP_NAME || 'Gaushala Reminder System';
  res.locals.success = req.session.success;
  res.locals.error = req.session.error;
  res.locals.admin = req.session.admin;
  delete req.session.success;
  delete req.session.error;
  next();
});

app.get('/', (req, res) => {
  if (req.session.admin) return res.redirect('/dashboard');
  return res.redirect('/login');
});

app.use(require('./routes/auth'));
app.use(require('./routes/dashboard'));
app.use(require('./routes/members'));
app.use(require('./routes/notifications'));
app.use(require('./routes/subscription'));

app.use((req, res) => {
  res.status(404).render('layout/error', { title: 'Page Not Found', message: 'The page you requested was not found.' });
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).render('layout/error', { title: 'Server Error', message: 'Something went wrong. Please try again.' });
});

const port = process.env.PORT || 3000;

async function boot() {
  await sequelize.authenticate();
  await sessionStore.sync();
  if (process.env.NODE_ENV !== 'production') {
    await sequelize.sync();
  }
  scheduleReminderJob();
  app.listen(port, () => {
    console.log(`Gaushala Reminder System running at http://localhost:${port}`);
  });
}

boot().catch((error) => {
  console.error('Unable to start application:', error);
  process.exit(1);
});

module.exports = app;
