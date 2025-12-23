CREATE TABLE tickets (
  tier TEXT PRIMARY KEY,
  price INT NOT NULL,
  available INT NOT NULL
);

INSERT INTO tickets (tier, price, available) VALUES
('VIP', 100, 100),
('FRONT_ROW', 50, 200),
('GA', 10, 500);
