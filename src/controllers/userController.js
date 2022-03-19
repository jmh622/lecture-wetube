import bcrypt from 'bcrypt';
import User from '../models/User';

export const getJoin = (req, res) => res.render('join', { pateTitle: 'Join' });
export const postJoin = async (req, res) => {
  const { name, email, username, password, password2, location } = req.body;

  if (password !== password2) {
    return res.status(400).render('join', { pateTitle: 'Join', errorMessage: 'Password confirmation does not match.' });
  }

  const exists = await User.exists({ $or: [{ username }, { email }] });
  if (exists) {
    return res.status(400).render('join', { pateTitle: 'Join', errorMessage: 'This username/email is already taken.' });
  }

  try {
    await User.create({
      name,
      email,
      username,
      password,
      location,
    });
    return res.status(201).redirect('/login');
  } catch (error) {
    return res.status(400).render('join', { pateTitle: 'Join', errorMessage: error._message });
  }
};
export const edit = (req, res) => res.send('Edit User');
export const remove = (req, res) => res.send('Remove User');
export const getLogin = (req, res) => res.render('login', { pageTitle: 'Login' });
export const postLogin = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).render('login', { pateTitle: 'Login', errorMessage: 'An account does not exists.' });
  }
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(400).render('login', { pateTitle: 'Login', errorMessage: 'Wrong password.' });
  }

  return res.redirect('/');
};
export const logout = (req, res) => res.send('Logout');
export const see = (req, res) => res.send('See User');
