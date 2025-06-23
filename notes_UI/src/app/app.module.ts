import {NgModule} from '@angular/core';
import { Register } from './components/register/register';
import { Login } from './components/login/login';
import { NoteForm } from './components/note-form/note-form';
import { NoteList } from './components/note-list/note-list';

@NgModule({
  declarations: [ ],
  imports: [
    Register,
    NoteList,
    Login,
    NoteForm,
  ],
})
export class AppModule { }