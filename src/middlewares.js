import multer from 'multer';
import multerS3 from 'multer-s3';
import aws from 'aws-sdk';

const s3 = new aws.S3({
  credentials: {
    accessKeyId: process.env.AWS_S3_ID,
    secretAccessKey: process.env.AWS_S3_SECRET,
  },
});

export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.loggedInUser = res.locals.loggedIn ? req.session.user : undefined;
  res.locals.isHeroku = process.env.NODE_ENV === 'production';
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

const s3ImageUploader = multerS3({
  s3: s3,
  bucket: 'wetube-muho/images',
  acl: 'public-read',
});

const s3VideoUploader = multerS3({
  s3: s3,
  bucket: 'wetube-muho/videos',
  acl: 'public-read',
});

export const uploadAvatarMiddleware = multer({
  dest: 'uploads/avatars/',
  limits: { fileSize: 3000000 },
  storage: isHeroku ? s3ImageUploader : undefined,
}).single('avatar');

export const uploadVideoMiddleware = multer({
  dest: 'uploads/videos/',
  limits: { fileSize: 1000000 },
  storage: isHeroku ? s3VideoUploader : undefined,
}).single('video');
