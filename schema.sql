CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_email (email)
);

CREATE TABLE IF NOT EXISTS categories (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL UNIQUE,
  PRIMARY KEY (id)
);

INSERT IGNORE INTO categories (name) VALUES
('Kurtas'),
('T-shirts'),
('Shoes'),
('Sandals'),
('Sarees'),
('Hijabs'),
('Kurtis'),
('Serwanis'),
('Jeans');
