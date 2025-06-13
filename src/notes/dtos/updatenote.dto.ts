import { PartialType } from '@nestjs/mapped-types';
import { CreateNoteDto } from './createnote.dto';

export class UpdateNoteDto extends PartialType(CreateNoteDto) {}
