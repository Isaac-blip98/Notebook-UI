CREATE OR REPLACE FUNCTION create_user(
  p_name TEXT,
  p_email TEXT,
  p_password TEXT
)
RETURNS TABLE(id INTEGER, name TEXT, email TEXT, created_at TIMESTAMP)
AS $$
BEGIN
  RETURN QUERY
  INSERT INTO users (name, email, password)
  VALUES (p_name, p_email, p_password)
  RETURNING users.id, users.name, users.email, users.created_at;
END;
$$ LANGUAGE plpgsql;

DROP FUNCTION IF EXISTS create_user(TEXT, TEXT, TEXT);
