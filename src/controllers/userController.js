import bcrypt from 'bcrypt';
import fetch from 'node-fetch';
import User from '../models/User';

export const getJoin = (req, res) => res.render('join', { pageTitle: 'Join' });
export const postJoin = async (req, res) => {
  const { name, email, username, password, password2, location } = req.body;

  if (password !== password2) {
    return res.status(400).render('join', { pageTitle: 'Join', errorMessage: 'Password confirmation does not match.' });
  }

  const exists = await User.exists({ $or: [{ username }, { email }] });
  if (exists) {
    return res.status(400).render('join', { pageTitle: 'Join', errorMessage: 'This username/email is already taken.' });
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
    return res.status(400).render('join', { pageTitle: 'Join', errorMessage: error._message });
  }
};
export const getEdit = (req, res) => res.render('edit-profile', { pageTitle: 'Edit Profile' });
export const postEdit = async (req, res) => {
  const {
    session: {
      user: { _id, avatarUrl },
    },
    body: { username, name, email, location },
    file,
  } = req;
  const updatedUser = await User.findByIdAndUpdate(
    _id,
    {
      username,
      name,
      email,
      location,
      avatarUrl: file ? `/${file.path}` : avatarUrl,
    },
    { new: true }
  );
  req.session.user = updatedUser;
  return res.redirect('/users/edit');
};
export const remove = (req, res) => res.send('Remove User');
export const getLogin = (req, res) => res.render('login', { pageTitle: 'Login' });
export const postLogin = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).render('login', { pageTitle: 'Login', errorMessage: 'An account does not exists.' });
  }
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(400).render('login', { pageTitle: 'Login', errorMessage: 'Wrong password.' });
  }

  req.session.loggedIn = true;
  req.session.user = user;

  return res.redirect('/');
};
export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect('/');
};
export const see = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).populate({
    path: 'videos',
    populate: {
      path: 'owner',
      model: 'User',
    },
  });
  if (!user) {
    return res.status(404).render('404', { pageTitle: 'User not found' });
  }
  // without populate
  // const videos = await Video.find({ owner: user._id });
  return res.render('users/profile', { pageTitle: `${user.name} Profile`, user });
};
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
export const getChangePassword = (req, res) => {
  if (req.session.user.socialOnly === true) {
    return res.redirect('/');
  }
  return res.render('change-password', { pageTitle: 'Change Password' });
};
export const postChangePassword = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    body: { oldPassword, newPassword, newPassword2 },
  } = req;
  const user = await User.findById(_id);
  const ok = await bcrypt.compare(oldPassword, user.password);
  if (!ok) {
    return res.status(400).render('change-password', { pageTitle: 'Change Password', errorMessage: 'the current password incorrect' });
  }
  if (newPassword !== newPassword2) {
    return res.status(400).render('change-password', { pageTitle: 'Change Password', errorMessage: 'the new password does not match' });
  }
  user.password = newPassword;
  await user.save();
  return res.redirect('/');
};
