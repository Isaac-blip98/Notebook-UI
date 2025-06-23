import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import { User } from './user';
import { AuthResponse, LoginRequest, RegisterRequest } from '../model/use';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  constructor(private http:HttpClient, private  router:Router) {
    //check if user is already logged in
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
  if (token && user) {
    try {
      const parsedUser = JSON.parse(user);
      this.currentUserSubject.next(parsedUser);
    } catch (error) {
      console.error('Invalid user JSON in localStorage:', error);
      localStorage.removeItem('user'); // Optional cleanup
    }
  }
}

  register( data: RegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, data)
  }

  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, data)
      .pipe(
        tap( response => {
          localStorage.setItem('token', response.access_token);
          localStorage.setItem('user', JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
        })
      )
  }

  logout():void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.router.navigate(['login']);
  }

  isLoggedIn():boolean{
    return !!localStorage.getItem('token');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}