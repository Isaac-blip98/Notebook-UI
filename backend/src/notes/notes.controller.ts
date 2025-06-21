import { UseGuards, Request, Controller, Post, Body, Get, Param, Put, Delete, ParseIntPipe } from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dtos/createnote.dto';
import { UpdateNoteDto } from './dtos/updatenote.dto';
import { Note } from './interface/notes.interface';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Notes')
@UseGuards(JwtAuthGuard)
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new note' })
  @ApiResponse({ status: 201, description: 'Note created successfully' })
  async create(@Body() createNoteDto: CreateNoteDto, @Request() req): Promise<Note> {
    return this.notesService.create(createNoteDto, req.user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all notes for current user' })
  @ApiResponse({ status: 200, description: 'List of user notes' })
  async findAll(@Request() req): Promise<Note[]> {
    return this.notesService.findAll(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific note by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Single note returned' })
  async findOne(@Param('id', ParseIntPipe) id: number, @Request() req): Promise<Note> {
    return this.notesService.findOne(id, req.user.userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a note by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Note updated successfully' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateNoteDto: UpdateNoteDto,
    @Request() req,
  ): Promise<Note> {
    return this.notesService.update(id, updateNoteDto, req.user.userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a note by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Note deleted successfully' })
  async remove(@Param('id', ParseIntPipe) id: number, @Request() req): Promise<{ message: string }> {
    return this.notesService.remove(id, req.user.userId);
  }
}
