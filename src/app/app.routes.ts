import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'employee',
    pathMatch: 'full'
  },
  {
    path: 'employee',
    loadComponent: () =>
      import('./features/employee/components/employee-form/employee-page.component')
        .then(m => m.EmployeePageComponent),
    title: 'Employee Management — HRM'
  },
  {
    path: '**',
    redirectTo: 'employee'
  }
];
