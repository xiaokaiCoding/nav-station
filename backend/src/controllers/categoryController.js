const pool = require('../db');

exports.getAll = async (req, res) => {
  try {
    const [categories] = await pool.query(
      'SELECT * FROM categories ORDER BY sort_order ASC, id ASC'
    );
    const [bookmarks] = await pool.query(
      'SELECT * FROM bookmarks ORDER BY sort_order ASC, id ASC'
    );
    const result = categories.map(cat => ({
      ...cat,
      bookmarks: bookmarks.filter(b => b.category_id === cat.id)
    }));
    res.json({ code: 0, data: result });
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, icon, sort_order } = req.body;
    const [result] = await pool.query(
      'INSERT INTO categories (name, icon, sort_order) VALUES (?, ?, ?)',
      [name, icon || '', sort_order || 0]
    );
    res.json({ code: 0, data: { id: result.insertId } });
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, icon, sort_order } = req.body;
    await pool.query(
      'UPDATE categories SET name=?, icon=?, sort_order=? WHERE id=?',
      [name, icon, sort_order, id]
    );
    res.json({ code: 0 });
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM categories WHERE id=?', [id]);
    res.json({ code: 0 });
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
};
