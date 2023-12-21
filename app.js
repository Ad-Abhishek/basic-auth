const express = require('express');
const dotenv = require('dotenv').config();
const ejs = require('ejs');
const bcrypt = require('bcrypt');

const app = express();

var users = [];

app.use(express.urlencoded({ extended: false }));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.send(
    `endpoints: <br /> Login - <strong>/login</strong> <br /> Register - <strong>/register</strong>`
  );
});

app.get('/login', (req, res) => {
  res.render('login.ejs');
});

app.get('/register', (req, res) => {
  res.render('register.ejs');
});

app.post('/login', async (req, res) => {
  const user = users.find((user) => user.email === req.body.email);

  if (user === null) {
    return res.status(400).send('Cant find user!');
  }
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      res.send(`welcome <h1> ${user.name} </h1>`);
    } else {
      res.send('Not Allowed');
    }
  } catch (error) {
    res.status(500).send();
  }
});

app.post('/register', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    users.push({
      id: new Date().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });
    res.redirect('/login');
  } catch {
    res.redirect('/register');
  }
});

const port = process.env.SERVER_PORT || 4000;

app.listen(port, (req, res) => {
  console.log(`Listening on port ${port}`);
});
