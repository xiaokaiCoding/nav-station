CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
  password VARCHAR(255) NOT NULL COMMENT '密码(加密)',
  role ENUM('user', 'admin') DEFAULT 'user' COMMENT '角色',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 插入默认管理员 (密码: rk1110001237)
INSERT IGNORE INTO users (username, password, role) VALUES (
  'raokai',
  '$2b$10$e3GFZir2COypdKx8hW3if.P75.vzeziIEuCBw9VuPbmckrU4amX0m',
  'admin'
);
