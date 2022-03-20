export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.loggedInUser = res.locals.loggedIn ? req.session.user : undefined;
  next();
};
