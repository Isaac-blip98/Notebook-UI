import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateNoteDto } from './dtos/createnote.dto';
import { pool } from 'src/db/pg.pool';
import { Note } from './interface/notes.interface';
import { UpdateNoteDto } from './dtos/updatenote.dto';

@Injectable()
export class NotesService {
async create(createNoteDto: CreateNoteDto, userId: number): Promise<Note> {
  const { title, content } = createNoteDto;

  const existing = await pool.query(
    'SELECT * FROM notes WHERE title = $1 AND content = $2 AND user_id = $3',
    [title, content, userId]
  );

  if (existing.rows.length > 0){
    throw new Error('A note with the same title and content already exists');
  }

  const result = await pool.query(
    'SELECT * FROM create_note($1, $2, $3)',
    [title, content, userId]
  );

  return result.rows[0];
}

async findAll(userId: number): Promise<Note[]> {
  const result = await pool.query('SELECT * FROM get_all_notes_for_user($1)', [userId]);
  return result.rows;
}

async findOne(id: number, userId: number): Promise<Note> {
  const result = await pool.query('SELECT * FROM get_note_by_id_for_user($1, $2)', [id, userId]);
  if (result.rows.length === 0) {
    throw new NotFoundException(`Note with ID ${id} not found`);
  }
  return result.rows[0];
}

async update(id: number, updateNoteDto: UpdateNoteDto, userId: number): Promise<Note> {
  const { title, content } = updateNoteDto;
  const result = await pool.query(
    'SELECT * FROM update_note_for_user($1, $2, $3, $4)',
    [id, title, content, userId]
  );
  if (result.rows.length === 0) {
    throw new NotFoundException(`Note with ID ${id} not found or not updated`);
  }
  return result.rows[0];
}

async remove(id: number, userId: number): Promise<{ message: string }> {
  const result = await pool.query('SELECT delete_note_for_user($1, $2)', [id, userId]);
  if (result.rowCount === 0) {
    throw new NotFoundException(`Note with ID ${id} not found`);
  }
  return { message: `Note with ID ${id} deleted successfully` };
}}
