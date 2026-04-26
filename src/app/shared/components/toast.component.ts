import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container position-fixed bottom-0 end-0 p-3" style="z-index:9999">
      @for (t of toast.toasts(); track t.id) {
        <div class="toast show align-items-center border-0 mb-2"
             [class]="toastClass(t.type)"
             role="alert">
          <div class="d-flex">
            <div class="toast-body d-flex align-items-center gap-2">
              <i [class]="iconClass(t.type)"></i>
              {{ t.message }}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto"
                    (click)="toast.remove(t.id)"></button>
          </div>
        </div>
      }
    </div>
  `
})
export class ToastComponent {
  toast = inject(ToastService);

  toastClass(type: string): string {
    const map: Record<string, string> = {
      success: 'text-bg-success',
      error: 'text-bg-danger',
      warning: 'text-bg-warning',
      info: 'text-bg-info'
    };
    return map[type] ?? 'text-bg-secondary';
  }

  iconClass(type: string): string {
    const map: Record<string, string> = {
      success: 'bi bi-check-circle-fill',
      error: 'bi bi-x-circle-fill',
      warning: 'bi bi-exclamation-triangle-fill',
      info: 'bi bi-info-circle-fill'
    };
    return map[type] ?? 'bi bi-bell-fill';
  }
}
