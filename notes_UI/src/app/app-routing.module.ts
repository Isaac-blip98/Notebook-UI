import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { NoteForm } from './components/note-form/note-form';

const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'notes', component: NodeList, canActivate: [AuthGuard] },
  { path: 'notes/create', component: NoteForm, canActivate: [AuthGuard] },
  { path: 'notes/edit/:id', component: NoteForm, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/register', pathMatch: 'full' },

  { path: '**', redirectTo: '/register' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }