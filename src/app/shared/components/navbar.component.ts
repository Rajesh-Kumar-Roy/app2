import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar navbar-expand-md navbar-dark" style="background:linear-gradient(90deg,#0a3d6b,#0f4c81);height:60px;min-height:60px;">
      <div class="container-fluid px-3">
        <a class="navbar-brand d-flex align-items-center gap-2 fw-bold" routerLink="/employee">
          <div class="brand-icon">
            <i class="bi bi-building-fill-gear"></i>
          </div>
          <div class="d-none d-sm-block">
            <span style="font-size:1rem">HRM</span>
            <span class="text-white-50 fw-normal" style="font-size:0.7rem;display:block;margin-top:-4px">Human Resource Management</span>
          </div>
        </a>

        <div class="d-flex align-items-center gap-2 ms-auto">
          <a routerLink="/employee" routerLinkActive="active"
             class="nav-link-pill">
            <i class="bi bi-people-fill me-1"></i>
            <span class="d-none d-sm-inline">Employees</span>
          </a>

          <div class="vr text-white-50 mx-1"></div>

          <div class="d-flex align-items-center gap-2">
            <div class="user-avatar">
              <i class="bi bi-person-fill"></i>
            </div>
            <span class="text-white-50 small d-none d-md-inline">Admin</span>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .brand-icon {
      width: 34px; height: 34px;
      background: linear-gradient(135deg,#3b82f6,#1d4ed8);
      border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
      font-size: 1rem; color: white;
    }
    .nav-link-pill {
      color: rgba(255,255,255,0.75);
      padding: 5px 12px;
      border-radius: 20px;
      font-size: 0.82rem; font-weight: 500;
      text-decoration: none;
      transition: all 0.2s;
      display: flex; align-items: center;
    }
    .nav-link-pill:hover, .nav-link-pill.active {
      background: rgba(255,255,255,0.15);
      color: white;
    }
    .user-avatar {
      width: 32px; height: 32px;
      background: rgba(255,255,255,0.15);
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      color: white; font-size: 0.9rem;
    }
  `]
})
export class NavbarComponent {}
