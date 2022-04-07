import multer from 'multer';

export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.loggedInUser = res.locals.loggedIn ? req.session.user : undefined;
  next();
};

export const protectorMiddleware = (req, res, next) => {
  if (!req.session.loggedIn) {
    req.flash('error', 'Not authorized');
    return res.redirect('/login');
  }

  next();
};

export const publicOnlyMiddleware = (req, res, next) => {
  if (req.session.loggedIn) {
    req.flash('error', 'Log in first.');
    return res.redirect('/');
  }

  next();
};

export const uploadAvatarMiddleware = multer({ dest: 'uploads/avatars/', limits: { fileSize: 3000000 } }).single('avatar');
export const uploadVideoMiddleware = multer({ dest: 'uploads/videos/', limits: { fileSize: 1000000 } }).single('video');
