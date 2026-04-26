import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar.component';
import { ToastComponent } from './shared/components/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, ToastComponent],
  template: `
    <app-navbar></app-navbar>
    <router-outlet></router-outlet>
    <app-toast></app-toast>
  `,
  styles: [`
    :host { display: flex; flex-direction: column; height: 100vh; }
  `]
})
export class AppComponent {}
