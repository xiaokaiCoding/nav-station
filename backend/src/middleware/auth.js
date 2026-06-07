const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../controllers/authController');

// 验证登录态
function auth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.json({ code: 401, message: '未登录' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.json({ code: 401, message: '登录已过期' });
  }
}

// 仅管理员
function adminOnly(req, res, next) {
  auth(req, res, () => {
    if (req.user.role !== 'admin') return res.json({ code: 403, message: '需要管理员权限' });
    next();
  });
}

module.exports = { auth, adminOnly };
