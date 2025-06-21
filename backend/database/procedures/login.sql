CREATE OR REPLACE FUNCTION get_user_by_email(p_email TEXT)
RETURNS TABLE(id INTEGER, name TEXT, email TEXT, password TEXT)
AS $$
BEGIN
  RETURN QUERY
  SELECT users.id, users.name, users.email, users.password
  FROM users
  WHERE LOWER(users.email) = LOWER(p_email);
END;
$$ LANGUAGE plpgsql;


-- DROP FUNCTION IF EXISTS get_user_by_email(TEXT);
