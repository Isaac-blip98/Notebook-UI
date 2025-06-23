import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Register } from './components/register/register';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Register],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'notes_new';
}
