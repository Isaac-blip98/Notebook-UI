-- Create table: notes
CREATE TABLE IF NOT EXISTS notes (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE notes ADD CONSTRAINT unique_title_content UNIQUE (title, content);


-- Drop existing functions if needed
DROP FUNCTION IF EXISTS create_note(VARCHAR, TEXT);
DROP FUNCTION IF EXISTS get_all_notes();
DROP FUNCTION IF EXISTS get_note_by_id(INT);
DROP FUNCTION IF EXISTS update_note(INT, VARCHAR, TEXT);
DROP FUNCTION IF EXISTS delete_note(INT);

--create_note
CREATE OR REPLACE FUNCTION create_note(p_title VARCHAR, p_content TEXT)
RETURNS TABLE(id INT, title VARCHAR, content TEXT, created_at TIMESTAMP) AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM notes WHERE notes.title = p_title AND notes.content = p_content
  ) THEN
    RAISE EXCEPTION 'Note already exists';
  END IF;

  RETURN QUERY
  INSERT INTO notes (title, content)
  VALUES (p_title, p_content)
  RETURNING notes.id, notes.title, notes.content, notes.created_at;
END;
$$ LANGUAGE plpgsql;


--get_all_notes
CREATE OR REPLACE FUNCTION get_all_notes()
RETURNS TABLE(id INT, title VARCHAR, content TEXT, created_at TIMESTAMP) AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM notes ORDER BY created_at DESC;
END;
$$ LANGUAGE plpgsql;

--get_note_by_id
CREATE OR REPLACE FUNCTION get_note_by_id(p_id INT)
RETURNS TABLE(id INT, title VARCHAR, content TEXT, created_at TIMESTAMP) AS $$
BEGIN
  RETURN QUERY
  SELECT notes.id, notes.title, notes.content, notes.created_at
  FROM notes
  WHERE notes.id = p_id;
END;
$$ LANGUAGE plpgsql;


--update_note
CREATE OR REPLACE FUNCTION update_note(p_id INT, p_title VARCHAR, p_content TEXT)
RETURNS TABLE(id INT, title VARCHAR, content TEXT, created_at TIMESTAMP) AS $$
BEGIN
  RETURN QUERY
  UPDATE notes
  SET title = p_title,
      content = p_content
  WHERE notes.id = p_id

  RETURNING *;
END;
$$ LANGUAGE plpgsql;

-- delete_note
CREATE OR REPLACE FUNCTION delete_note(p_id INT)
RETURNS VOID AS $$
BEGIN
  DELETE FROM notes WHERE id = p_id;
END;
$$ LANGUAGE plpgsql;
