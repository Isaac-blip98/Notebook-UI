import { Component, OnInit } from '@angular/core';
import { NotesService } from '../../services/notes.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Note } from '../../model/notes';

@Component({
  selector: 'app-note-form',
  templateUrl: './note-form.html',
  styleUrl: './note-form.css'
})
export class NoteForm implements OnInit {
 noteForm: FormGroup;
  loading = false;
  isEditMode = false;
  noteId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private notesService: NotesService
  ) {
    this.noteForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(1)]],
      content: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.noteId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.noteId;

    if (this.isEditMode && this.noteId) {
      this.loadNote(this.noteId);
    }
  }

  loadNote(id: string): void {
    this.notesService.getNoteById(id).subscribe({
      next: (note: Note) => {
        this.noteForm.patchValue({
          title: note.title,
          content: note.content
        });
      },
      error: (err) => {
        console.error('Error loading note:', err);
        this.router.navigate(['/notes']);
      }
    });
  }

  onSubmit(): void {
    if (this.noteForm.valid) {
      this.loading = true;

      const noteData = this.noteForm.value;

      if (this.isEditMode && this.noteId) {
        this.notesService.updateNote(this.noteId, noteData).subscribe({
          next: () => {
            this.router.navigate(['/notes']);
          },
          error: (err) => {
            console.error('Error updating note:', err);
            this.loading = false;
          }
        });
      } else {
        this.notesService.createNote(noteData).subscribe({
          next: () => {
            this.router.navigate(['/notes']);
          },
          error: (err) => {
            console.error('Error creating note:', err);
            this.loading = false;
          }
        });
      }
    }
  }

  cancel(): void {
    this.router.navigate(['/notes']);
  }
}
