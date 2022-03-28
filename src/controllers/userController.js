import bcrypt from 'bcrypt';
import fetch from 'node-fetch';
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
      socialOnly: false,
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

  req.session.loggedIn = true;
  req.session.user = user;

  return res.redirect('/');
};
export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect('/');
};
export const see = (req, res) => res.send('See User');
export const startGithubLogin = (req, res) => {
  const baseUrl = 'https://github.com/login/oauth/authorize';
  const config = {
    client_id: process.env.GH_CLIENT_ID,
    scope: 'read:user user:email',
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};
export const finishGithubLogin = async (req, res) => {
  const baseUrl = 'https://github.com/login/oauth/access_token';
  const config = {
    client_id: process.env.GH_CLIENT_ID,
    client_secret: process.env.GH_SECRET_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  const tokenData = await (
    await fetch(finalUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
    })
  ).json();
  if ('access_token' in tokenData) {
    const { access_token } = tokenData;
    const apiUrl = 'https://api.github.com';
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailObj = emailData.find((email) => email.primary === true && email.verified === true);
    if (!emailObj) {
      res.redirect('/login');
    }
    let user = await User.findOne({ email: emailObj.email });
    if (!user) {
      user = await User.create({
        name: userData.name,
        email: emailObj.email,
        username: userData.login,
        password: '',
        location: userData.location,
        socialOnly: true,
        avatarUrl: userData.avatar_url,
      });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect('/');
  } else {
    res.redirect('/login');
  }
};
