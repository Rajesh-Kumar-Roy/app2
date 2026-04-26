import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeListComponent } from '../employee-list/employee-list.component';
import { EmployeeFormComponent } from '../employee-form/employee-form.component';
import { EmployeeStateService } from '../../../../core/services/employee-state.service';

@Component({
  selector: 'app-employee-page',
  standalone: true,
  imports: [CommonModule, EmployeeListComponent, EmployeeFormComponent],
  template: `
    <div class="emp-page">

      <!-- Sidebar -->
      <div class="emp-sidebar" [class.mobile-open]="sidebarOpen()">
        <app-employee-list (click)="closeSidebar()"></app-employee-list>
      </div>

      <!-- Mobile overlay -->
      @if (sidebarOpen()) {
        <div class="mob-overlay" (click)="sidebarOpen.set(false)"></div>
      }

      <!-- Main form -->
      <div class="emp-main">
        <app-employee-form></app-employee-form>
      </div>

      <!-- Mobile FAB to open sidebar -->
      <button class="mob-fab d-md-none" (click)="sidebarOpen.set(!sidebarOpen())"
              title="Employee List">
        <i class="bi" [class.bi-x-lg]="sidebarOpen()" [class.bi-people-fill]="!sidebarOpen()"></i>
      </button>
    </div>
  `,
  styles: [`
    .emp-page {
      display: flex;
      height: calc(100vh - 60px);
      overflow: hidden;
      background: #dde3ea;
    }

    /* Sidebar */
    .emp-sidebar {
      width: 210px;
      flex-shrink: 0;
      height: 100%;
      overflow: hidden;
      border-right: 1px solid rgba(0,0,0,0.15);
    }

    /* Main form area */
    .emp-main {
      flex: 1;
      height: 100%;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    /* Mobile */
    @media (max-width: 767px) {
      .emp-sidebar {
        position: fixed;
        left: 0; top: 60px;
        height: calc(100vh - 60px);
        width: 260px;
        z-index: 1050;
        transform: translateX(-100%);
        transition: transform 0.28s ease;
        box-shadow: 4px 0 20px rgba(0,0,0,0.25);
      }
      .emp-sidebar.mobile-open {
        transform: translateX(0);
      }
      .emp-main { width: 100%; }
    }

    .mob-overlay {
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.4);
      z-index: 1040;
    }

    .mob-fab {
      position: fixed;
      bottom: 22px; left: 22px;
      z-index: 1060;
      width: 46px; height: 46px;
      border-radius: 50%;
      background: #1a3a5c;
      color: #fff; border: none;
      font-size: 1.1rem;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 4px 14px rgba(0,0,0,0.3);
      cursor: pointer;
    }
  `]
})
export class EmployeePageComponent {
  state = inject(EmployeeStateService);
  sidebarOpen = signal(false);

  closeSidebar() {
    if (window.innerWidth < 768) this.sidebarOpen.set(false);
  }
}
