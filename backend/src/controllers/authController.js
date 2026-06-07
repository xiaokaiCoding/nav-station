const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'nav-station-secret-key-2024';
module.exports.JWT_SECRET = JWT_SECRET;

// 登录
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.json({ code: 400, message: '用户名和密码不能为空' });
    const [users] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (users.length === 0) return res.json({ code: 401, message: '用户名或密码错误' });
    const valid = await bcrypt.compare(password, users[0].password);
    if (!valid) return res.json({ code: 401, message: '用户名或密码错误' });
    const token = jwt.sign(
      { id: users[0].id, username: users[0].username, role: users[0].role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({ code: 0, data: { token, user: { id: users[0].id, username: users[0].username, role: users[0].role } } });
  } catch (err) { res.status(500).json({ code: 500, message: err.message }); }
};

// 注册
exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.json({ code: 400, message: '用户名和密码不能为空' });
    if (password.length < 6) return res.json({ code: 400, message: '密码至少6位' });
    const [exists] = await pool.query('SELECT id FROM users WHERE username = ?', [username]);
    if (exists.length > 0) return res.json({ code: 400, message: '用户名已存在' });
    const hashed = await bcrypt.hash(password, 10);
    const [result] = await pool.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashed]);
    res.json({ code: 0, data: { id: result.insertId } });
  } catch (err) { res.status(500).json({ code: 500, message: err.message }); }
};

// 修改密码 - 使用 JWT 里的 userId，不信任 body 中的 userId
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;
    if (!newPassword || newPassword.length < 6) return res.json({ code: 400, message: '密码至少6位' });
    const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
    if (users.length === 0) return res.json({ code: 404, message: '用户不存在' });
    const valid = await bcrypt.compare(oldPassword, users[0].password);
    if (!valid) return res.json({ code: 401, message: '旧密码错误' });
    const hashed = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashed, userId]);
    res.json({ code: 0 });
  } catch (err) { res.status(500).json({ code: 500, message: err.message }); }
};

// 获取用户列表 (仅管理员)
exports.getUsers = async (req, res) => {
  try {
    const [users] = await pool.query('SELECT id, username, role, created_at, updated_at FROM users ORDER BY id');
    res.json({ code: 0, data: users });
  } catch (err) { res.status(500).json({ code: 500, message: err.message }); }
};

// 修改用户角色 (仅管理员)
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) return res.json({ code: 400, message: '角色无效' });
    await pool.query('UPDATE users SET role = ? WHERE id = ?', [role, id]);
    res.json({ code: 0 });
  } catch (err) { res.status(500).json({ code: 500, message: err.message }); }
};

// 删除用户 (仅管理员)
exports.removeUser = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM users WHERE id = ?', [id]);
    res.json({ code: 0 });
  } catch (err) { res.status(500).json({ code: 500, message: err.message }); }
};

// 导出供 auth middleware 使用的 JWT_SECRET，保留所有 handler
