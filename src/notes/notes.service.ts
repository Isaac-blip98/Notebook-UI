import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateNoteDto } from './dtos/createnote.dto';
import { pool } from 'src/db/pg.pool';
import { Note } from './interface/notes.interface';
import { UpdateNoteDto } from './dtos/updatenote.dto';

@Injectable()
export class NotesService {
      async create(createNoteDto: CreateNoteDto): Promise<Note> {
    const { title, content } = createNoteDto;

    const existing = await pool.query(
        'SELECT * FROM notes WHERE title = $1 AND content = $2',
        [title, content]
    );

    if (existing.rows.length > 0){
        throw new Error('A note with the same title and content already exists');
    }

    const result = await pool.query(
      'SELECT * FROM create_note($1, $2)',
      [title, content]
    );
    return result.rows[0];
  }

  async findAll(): Promise<Note[]> {
    const result = await pool.query('SELECT * FROM get_all_notes()');
    return result.rows;
  }

  async findOne(id: number): Promise<Note> {
    const result = await pool.query(
      'SELECT * FROM get_note_by_id($1)',
      [id]
    );

    if (result.rows.length === 0) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }
    return result.rows[0];
  }

  async update(id: number, updateNoteDto: UpdateNoteDto): Promise<Note> {
    const { title, content } = updateNoteDto;
    const result = await pool.query(
      'SELECT * FROM update_note($1, $2, $3)',
      [id, title, content]
    );
    if (result.rows.length === 0) {
      throw new NotFoundException(`Note with ID ${id} not found or not updated`);
    }
    return result.rows[0];
  }

  async remove(id: number): Promise<{ message: string }> {
    await pool.query('SELECT delete_note($1)', [id]);
    return { message: `Note with ID ${id} deleted successfully` };
  }
}
