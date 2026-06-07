-- Tables only (MYSQL_DATABASE env creates the database)
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL COMMENT '分类名称',
  icon VARCHAR(50) DEFAULT '' COMMENT '图标/emoji',
  sort_order INT DEFAULT 0 COMMENT '排序',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='分类表';

CREATE TABLE IF NOT EXISTS bookmarks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT NOT NULL COMMENT '所属分类ID',
  title VARCHAR(200) NOT NULL COMMENT '网站名称',
  url VARCHAR(500) NOT NULL COMMENT '链接地址',
  description TEXT COMMENT '描述',
  icon VARCHAR(500) DEFAULT '' COMMENT '网站图标URL',
  sort_order INT DEFAULT 0 COMMENT '排序',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='书签表';

INSERT INTO categories (name, icon, sort_order) VALUES
('搜索引擎', '🔍', 1),
('社交媒体', '💬', 2),
('开发工具', '🛠️', 3);

INSERT INTO bookmarks (category_id, title, url, description, icon) VALUES
(1, 'Google', 'https://www.google.com', '全球最大的搜索引擎', ''),
(1, '百度', 'https://www.baidu.com', '中文搜索引擎', ''),
(2, 'Twitter', 'https://twitter.com', '社交媒体平台', ''),
(3, 'GitHub', 'https://github.com', '代码托管平台', '');
