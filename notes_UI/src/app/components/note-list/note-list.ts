import { Component, OnInit } from '@angular/core';
import { Note } from '../../model/notes';
import { NotesService } from '../../services/notes.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-note-list',
  templateUrl: './note-list.html',
  styleUrl: './note-list.css'
})
export class NoteList implements OnInit {
 notes: Note[] = [];
  loading = true;
  currentUser$: any;

  constructor(
    private notesService: NotesService,
    private authService: AuthService,
    private router: Router
  ) {
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit(): void {
    this.loadNotes();
  }

  loadNotes(): void {
    this.loading = true;
    this.notesService.getAllNotes().subscribe({
      next: (notes) => {
        this.notes = notes;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading notes:', err);
        this.loading = false;
      }
    });
  }

  createNote(): void {
    this.router.navigate(['/notes/create']);
  }

  editNote(id: string): void {
    this.router.navigate(['/notes/edit', id]);
  }

  deleteNote(id: string): void {
    if (confirm('Are you sure you want to delete this note?')) {
      this.notesService.deleteNote(id).subscribe({
        next: () => {
          this.loadNotes(); // Refresh the list
        },
        error: (err) => {
          console.error('Error deleting note:', err);
        }
      });
    }
}
}