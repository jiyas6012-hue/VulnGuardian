const userId = req.query.id;

db.query(
  "SELECT * FROM users WHERE id = " + userId
);