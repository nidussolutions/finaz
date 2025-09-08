import db from './database/connection.js';
import bcrypt from 'bcryptjs';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config(path)

const router = express.Router();

router.post('/sigin', (req, res) => {
  res.send('Sign In Route');
});

router.post('/signup', (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json('Incorrect form submission');
  }

  const hash = bcrypt.hashSync(password);

  const userExist = db('users')
    .where({ email })
    .then((data) => {
      if (data.length) {
        return res.status(400).json('User already exists');
      } else {
        return;
      }
    })
    .catch((err) => res.status(400).json('Error checking user existence'));

  if (userExist) return userExist;

  const user = db('users')
    .returning('*')
    .insert({
      name,
      email,
      password: hash,
      created_at: new Date(),
    })
    .then((user) => {
      res.json(user[0]);
    })
    .catch((err) => res.status(400).json('Unable to register'));

  res.status(201).json(user);
});


export default router;
