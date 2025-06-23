import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import { CreateNoteRequest, Note, UpdateNoteRequest } from '../model/notes';

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  private apiUrl = `${environment.apiUrl}/notes`;

  constructor(private http: HttpClient) { }

  getAllNotes():Observable<Note[]> {
    return  this.http.get<Note[]>(this.apiUrl)
  }

  getNoteById(id:string):Observable<Note> {
    return  this.http.get<Note>(`${this.apiUrl}/${id}`)
  }

  createNote(note:CreateNoteRequest): Observable<Note> {
    return  this.http.post<Note>(`${this.apiUrl}/${note}`, note)
  }

  updateNote(id:string, note:UpdateNoteRequest): Observable<Note> {
    return  this.http.patch<Note>(`${this.apiUrl}/${id}`, note)
  }

  deleteNote(id:string):Observable<Note> {
    return  this.http.delete<Note>(`${this.apiUrl}/${id}`)
  }
}


