const authService = require("../services/auth.service");

async function register(req, res, next) {
  try {
    const { user, accessToken, refreshToken } = await authService.register(req.body);
    return res.status(201).json({ user, accessToken, refreshToken });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { user, accessToken, refreshToken } = await authService.login(req.body);
    return res.json({ user, accessToken, refreshToken });
  } catch (err) {
    next(err);
  }
}

async function getMe(req, res, next) {
  try {
    const user = await authService.getMe(req.user.id);
    return res.json({ user });
  } catch (err) {
    next(err);
  }
}

async function refresh(req, res, next) {
  try {
    const { refreshToken } = req.body;
    const { accessToken } = await authService.refreshToken(refreshToken);
    return res.json({ accessToken });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, getMe, refresh };