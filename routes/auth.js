const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../config/db');
const session = require('express-session');

router.get('/login', async (req, res) => {
  if (req.session && req.session.userId)
    return res.redirect('/propositions/add')
  res.render('auth/login');
});

router.get('/', async (req, res) => {
  if (req.session && req.session.userId)
    return res.redirect('/propositions/add')
  else
    return res.redirect('/auth/login')
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const [[user]] = await db.query('SELECT * FROM users WHERE username = ?', [username]);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      req.flash('error_msg', 'Invalid username or password');
      return setTimeout(() => {
        res.redirect('/auth/login');
      }, 1000);
    }

    req.session.userId = user.id;
    req.session.isAdmin = user.is_admin;
    req.session.isJury = user.is_jury;

    res.redirect('/propositions/add');
  } catch (err) {
    req.flash('error', 'An error occurred');
    res.redirect('/auth/login');
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error(err);
      req.flash('error', 'An error occurred while logging out');
      return res.redirect('/propositions/add');
    }
    res.redirect('/auth/login');
  });
});

const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  } else {
    res.redirect('/auth/login');
  }
};

module.exports = { router, isAuthenticated };
