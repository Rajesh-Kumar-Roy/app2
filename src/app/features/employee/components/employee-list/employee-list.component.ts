import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EmployeeStateService } from '../../../../core/services/employee-state.service';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="employee-sidebar d-flex flex-column h-100">

      <!-- Header -->
      <div class="sidebar-header px-3 py-3">
        <div class="d-flex align-items-center justify-content-between mb-3">
          <div>
            <h6 class="mb-0 fw-bold text-white">Employee List</h6>
            <small class="text-white-50">{{ state.filteredList().length }} employee(s)</small>
          </div>
          <button class="btn btn-sm btn-add-new" (click)="addNew()" title="Add New Employee">
            <i class="bi bi-person-plus-fill"></i>
          </button>
        </div>
        <!-- Search -->
        <div class="search-box position-relative">
          <i class="bi bi-search position-absolute top-50 translate-middle-y ms-2 text-muted" style="left:4px"></i>
          <input type="text" class="form-control form-control-sm ps-4"
                 placeholder="Search by name, ID..."
                 [value]="state.searchQuery()"
                 (input)="state.searchQuery.set($any($event.target).value)" />
        </div>
      </div>

      <!-- Loading skeleton -->
      @if (state.loading() && state.employeeList().length === 0) {
        <div class="px-3 py-2">
          @for (i of [1,2,3,4,5]; track i) {
            <div class="skeleton-item mb-2"></div>
          }
        </div>
      }

      <!-- List -->
      <div class="employee-list-body flex-grow-1 overflow-auto px-2 pb-3">
        @if (!state.loading() && state.filteredList().length === 0) {
          <div class="text-center py-5 text-white-50">
            <i class="bi bi-people fs-2 d-block mb-2"></i>
            <small>No employees found</small>
          </div>
        }

        @for (emp of state.filteredList(); track emp.id) {
          <div class="employee-card"
               [class.active]="state.selectedEmployee()?.id === emp.id"
               (click)="selectEmployee(emp.id)">
            <div class="emp-avatar">
              {{ getInitials(emp.employeeName) }}
            </div>
            <div class="emp-info flex-grow-1 min-width-0">
              <div class="emp-name text-truncate">{{ emp.employeeName || 'N/A' }}</div>
              <div class="emp-designation text-truncate">{{ emp.designationName }}</div>
              <div class="emp-id">#{{ emp.id }}</div>
            </div>
            <div class="emp-actions">
              <button class="btn btn-xs btn-icon text-danger"
                      (click)="$event.stopPropagation(); deleteEmployee(emp)"
                      title="Delete">
                <i class="bi bi-trash3"></i>
              </button>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .employee-sidebar {
      background: linear-gradient(180deg, #0f4c81 0%, #0d3d6b 100%);
      min-height: 100%;
    }
    .sidebar-header {
      border-bottom: 1px solid rgba(255,255,255,0.1);
      background: rgba(0,0,0,0.15);
    }
    .btn-add-new {
      background: #22c55e;
      color: white;
      border: none;
      width: 32px; height: 32px;
      border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
      font-size: 1rem;
      transition: all 0.2s;
    }
    .btn-add-new:hover { background: #16a34a; transform: scale(1.05); color: white; }

    .search-box input {
      background: rgba(255,255,255,0.12);
      border: 1px solid rgba(255,255,255,0.2);
      color: white;
      border-radius: 8px;
    }
    .search-box input::placeholder { color: rgba(255,255,255,0.5); }
    .search-box input:focus {
      background: rgba(255,255,255,0.18);
      border-color: rgba(255,255,255,0.4);
      box-shadow: none;
      color: white;
    }
    .search-box .bi-search { color: rgba(255,255,255,0.5) !important; }

    .employee-card {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 8px;
      border-radius: 10px;
      margin-bottom: 4px;
      cursor: pointer;
      transition: all 0.2s;
      border: 1px solid transparent;
    }
    .employee-card:hover {
      background: rgba(255,255,255,0.12);
      border-color: rgba(255,255,255,0.15);
    }
    .employee-card.active {
      background: rgba(255,255,255,0.2);
      border-color: rgba(255,255,255,0.35);
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    }
    .emp-avatar {
      width: 38px; height: 38px;
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 0.75rem; font-weight: 700;
      color: white; flex-shrink: 0;
      text-transform: uppercase;
    }
    .employee-card.active .emp-avatar {
      background: linear-gradient(135deg, #f59e0b, #d97706);
    }
    .emp-name {
      font-size: 0.82rem; font-weight: 600;
      color: white; line-height: 1.2;
    }
    .emp-designation {
      font-size: 0.72rem; color: rgba(255,255,255,0.65);
    }
    .emp-id {
      font-size: 0.68rem; color: rgba(255,255,255,0.45);
    }
    .emp-actions { opacity: 0; transition: opacity 0.2s; }
    .employee-card:hover .emp-actions { opacity: 1; }
    .btn-icon {
      background: transparent; border: none;
      width: 24px; height: 24px; padding: 0;
      display: flex; align-items: center; justify-content: center;
      border-radius: 6px; font-size: 0.75rem;
    }
    .btn-icon:hover { background: rgba(255,0,0,0.15); }

    .skeleton-item {
      height: 50px; border-radius: 10px;
      background: linear-gradient(90deg, rgba(255,255,255,0.08) 25%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.08) 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
    }
    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `]
})
export class EmployeeListComponent implements OnInit {
  state = inject(EmployeeStateService);

  ngOnInit() {
    this.state.loadList();
  }

  selectEmployee(id: number) {
    this.state.selectEmployee(id);
  }

  addNew() {
    this.state.startNew();
  }

  deleteEmployee(emp: any) {
    if (confirm(`Delete "${emp.employeeName}"? This action cannot be undone.`)) {
      this.state.deleteEmployee(emp.id);
    }
  }

  getInitials(name: string | null): string {
    if (!name) return '?';
    return name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
  }
}
