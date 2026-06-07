const pool = require('../db');

exports.getAll = async (req, res) => {
  try {
    const { q } = req.query;
    let sql = 'SELECT * FROM bookmarks';
    let params = [];
    if (q) {
      sql += ' WHERE title LIKE ? OR url LIKE ? OR description LIKE ?';
      params = [`%${q}%`, `%${q}%`, `%${q}%`];
    }
    sql += ' ORDER BY sort_order ASC, id ASC';
    const [rows] = await pool.query(sql, params);
    res.json({ code: 0, data: rows });
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { category_id, title, url, description, icon, sort_order } = req.body;
    const [result] = await pool.query(
      'INSERT INTO bookmarks (category_id, title, url, description, icon, sort_order) VALUES (?, ?, ?, ?, ?, ?)',
      [category_id, title, url, description || '', icon || '', sort_order || 0]
    );
    res.json({ code: 0, data: { id: result.insertId } });
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { category_id, title, url, description, icon, sort_order } = req.body;
    await pool.query(
      'UPDATE bookmarks SET category_id=?, title=?, url=?, description=?, icon=?, sort_order=? WHERE id=?',
      [category_id, title, url, description, icon, sort_order, id]
    );
    res.json({ code: 0 });
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM bookmarks WHERE id=?', [id]);
    res.json({ code: 0 });
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
};
