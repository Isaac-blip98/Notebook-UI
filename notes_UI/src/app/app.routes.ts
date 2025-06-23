import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { AuthGuard } from './guards/auth.guard';
import { GuestGuard } from './guards/guest.guard';

export const routes: Routes = [
 {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },

  // Authentication routes (only accessible when NOT logged in)
  {
    path: 'login',
    component: Login,
    canActivate: [GuestGuard] // Prevents access if already logged in
  },
  {
    path: 'register',
    component: Register,
    canActivate: [GuestGuard] // Prevents access if already logged in
  },

  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'notes',
    loadComponent: () => import('./components/note-list/note-list').then(m => m.NoteList),
    canActivate: [AuthGuard]
  },
  {
    path: 'notes/new',
    loadComponent: () => import('./components/note-form/note-form').then(m => m.NoteForm),
    canActivate: [AuthGuard]
  },
  {
    path: 'notes/edit/:id',
    loadComponent: () => import('./components/note-form/note-form').then(m => m.NoteForm),
    canActivate: [AuthGuard]
  },

  // Catch-all route - redirect to login
  {
    path: '**',
    redirectTo: '/login'
  }
];
