-- Create table: notes
CREATE TABLE IF NOT EXISTS notes (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE notes ADD CONSTRAINT unique_title_content UNIQUE (title, content);

-- Drop existing functions if needed
DROP FUNCTION IF EXISTS create_note(TEXT, TEXT, INTEGER);
DROP FUNCTION IF EXISTS get_all_notes_for_user(INTEGER);
DROP FUNCTION IF EXISTS get_note_by_id_for_user(INT, INT);
DROP FUNCTION IF EXISTS update_note_for_user(INT, VARCHAR, TEXT, INT);
DROP FUNCTION IF EXISTS delete_note_for_user(INT, INT);

--create_note
CREATE OR REPLACE FUNCTION create_note(
  p_title TEXT,
  p_content TEXT,
  p_user_id INTEGER
)
RETURNS TABLE(
  id INTEGER,
  title TEXT,
  content TEXT,
  created_at TIMESTAMP
)
AS $$
BEGIN
  RETURN QUERY
  INSERT INTO notes (title, content, user_id)
  VALUES (p_title, p_content, p_user_id)
  RETURNING notes.id, notes.title::TEXT, notes.content, notes.created_at;
END;
$$ LANGUAGE plpgsql;


--get_all_notes_for_user
CREATE OR REPLACE FUNCTION get_all_notes_for_user(p_user_id INTEGER)
RETURNS TABLE(
  id INTEGER,
  title TEXT,
  content TEXT,
  created_at TIMESTAMP
)
AS $$
BEGIN
  RETURN QUERY
  SELECT notes.id, notes.title::TEXT, notes.content, notes.created_at
  FROM notes
  WHERE notes.user_id = p_user_id
  ORDER BY notes.created_at DESC;
END;
$$ LANGUAGE plpgsql;



--get_note_by_id_for_user
CREATE OR REPLACE FUNCTION get_note_by_id_for_user(p_id INT, p_user_id INT)
RETURNS TABLE(
  id INT,
  title TEXT,
  content TEXT,
  created_at TIMESTAMP
)
AS $$
BEGIN
  RETURN QUERY
  SELECT notes.id, notes.title::TEXT, notes.content, notes.created_at
  FROM notes
  WHERE notes.id = p_id AND notes.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;


--update_note_for_user
CREATE OR REPLACE FUNCTION update_note_for_user(
  p_id INT,
  p_title VARCHAR,
  p_content TEXT,
  p_user_id INT
)
RETURNS TABLE(
  id INT,
  title TEXT,
  content TEXT,
  created_at TIMESTAMP
)
AS $$
BEGIN
  RETURN QUERY
  UPDATE notes
  SET title = p_title,
      content = p_content
  WHERE notes.id = p_id AND notes.user_id = p_user_id
  RETURNING notes.id, notes.title::TEXT, notes.content, notes.created_at;
END;
$$ LANGUAGE plpgsql;



-- delete_note_for_user
CREATE OR REPLACE FUNCTION delete_note_for_user(p_id INT, p_user_id INT)
RETURNS VOID
AS $$
BEGIN
  DELETE FROM notes
  WHERE notes.id = p_id AND notes.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;
