const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const path = require('path');
const MySQLStore = require('express-mysql-session')(session);

const app = express();
const port = 3000;
const dbOptions = {
  host: 'localhost',
  user: 'root',
  database: 'proposif',
  password: '11020031234',
  checkExpirationInterval: 5 * 60 * 1000,
  expiration: 3 * 60 * 60 * 1000
};
const sessionStore = new MySQLStore(dbOptions);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const noCache = (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
};

function simulateLatency(req, res, next) {
  const delay = 2000;
  setTimeout(() => {
    next();
  }, delay);
}

// app.use(simulateLatency);
app.use(noCache);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: '2c0934jdfs4DF@@#FDSF',
  resave: false,
  saveUninitialized: true,
  store: sessionStore,
  cookie: {
    maxAge: 3 * 60 * 60 * 1000  
  }
}));
app.use(flash());
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

app.use(express.static(path.join(__dirname, 'public')));

const propositionRoutes = require('./routes/propositions');
const votingSessionRoutes = require('./routes/votes');
const imageRoutes = require('./routes/images');
const userRoutes = require('./routes/users');
const fonctionsRoutes = require('./routes/functions');
const { router: authRoutes, isAuthenticated } = require('./routes/auth');
const isJury = require('./middleware/checkUserJury')

app.use('/propositions', isAuthenticated, isJury,propositionRoutes);
app.use('/voting-sessions', isAuthenticated,votingSessionRoutes);
app.use('/images', isAuthenticated, imageRoutes);
app.use('/users', isAuthenticated, isJury, userRoutes);
app.use('/functions', isAuthenticated, isJury,fonctionsRoutes);
app.use('/auth', authRoutes);
app.use('/', authRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
